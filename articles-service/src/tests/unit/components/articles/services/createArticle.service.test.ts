import CreateArticleService from "@components/articles/services/createArticle.service";
import { ArticleModel, ArticleTagModel } from "@components/articles/models";
import { TagModel } from "@components/tags/models";
import articleCreatedHandler from "@libs/kafka/producers/articles/articleCreatedHandler";
import { BadRequestError, ConflictError } from "@errors/index";
import {Op} from "sequelize";

jest.mock("@components/articles/models", () => ({
    ArticleModel: {
        findOrCreate: jest.fn(),
    },
    ArticleTagModel: {
        bulkCreate: jest.fn(),
    },
}));

jest.mock("@components/tags/models", () => ({
    TagModel: {
        findAll: jest.fn(),
    },
}));

jest.mock("@libs/kafka/producers/articles/articleCreatedHandler", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("@libs/sequelize", () => ({
    transaction: jest.fn((cb) => cb({})), // передаём фиктивный transaction
}));

describe("CreateArticleService (unit)", () => {
    const mockTag1 = { id: 1, label: "tech" };
    const mockTag2 = { id: 2, label: "news" };
    const mockArticle = {
        id: 100,
        title: "New Article",
        content: "Some content",
        publishedAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("создаёт статью и вызывает articleCreatedHandler", async () => {
        const input = {
            title: "New Article",
            content: "Some content",
            tags: [1, 2],
        };

        (TagModel.findAll as jest.Mock).mockResolvedValueOnce([mockTag1, mockTag2]);
        (ArticleModel.findOrCreate as jest.Mock).mockResolvedValueOnce([mockArticle, true]);
        (ArticleTagModel.bulkCreate as jest.Mock).mockResolvedValueOnce(undefined);

        await CreateArticleService(input);

        expect(TagModel.findAll).toHaveBeenCalledWith({
            where: { id: { [Op.in]: [1, 2] } }
        });

        expect(ArticleModel.findOrCreate).toHaveBeenCalledWith({
            where: { title: "New Article" },
            defaults: { title: "New Article", content: "Some content" },
            transaction: {},
        });

        expect(ArticleTagModel.bulkCreate).toHaveBeenCalledWith(
            [
                { articleId: 100, tagId: 1 },
                { articleId: 100, tagId: 2 },
            ],
            { ignoreDuplicates: true, transaction: {} }
        );

        expect(articleCreatedHandler).toHaveBeenCalledWith(expect.objectContaining({
            id: 100,
            title: "New Article",
            content: "Some content",
            tags: [
                { id: 1, label: "tech" },
                { id: 2, label: "news" }
            ]
        }));
    });

    it("выбрасывает BadRequestError, если теги некорректны", async () => {
        const input = {
            title: "Another Article",
            content: "Content",
            tags: [1, 2],
        };

        (TagModel.findAll as jest.Mock).mockResolvedValueOnce([mockTag1]);

        await expect(CreateArticleService(input)).rejects.toThrow(BadRequestError);

        expect(ArticleModel.findOrCreate).not.toHaveBeenCalled();
        expect(articleCreatedHandler).not.toHaveBeenCalled();
    });

    it("выбрасывает ConflictError, если статья с таким заголовком уже существует", async () => {
        const input = {
            title: "Duplicate Article",
            content: "Some content",
            tags: [1],
        };

        (TagModel.findAll as jest.Mock).mockResolvedValueOnce([mockTag1]);
        (ArticleModel.findOrCreate as jest.Mock).mockResolvedValueOnce([mockArticle, false]);

        await expect(CreateArticleService(input)).rejects.toThrow(ConflictError);

        expect(ArticleTagModel.bulkCreate).not.toHaveBeenCalled();
        expect(articleCreatedHandler).not.toHaveBeenCalled();
    });

    it("прокидывает ошибку, если bulkCreate падает", async () => {
        const input = {
            title: "Failing Article",
            content: "Some content",
            tags: [1],
        };

        (TagModel.findAll as jest.Mock).mockResolvedValueOnce([mockTag1]);
        (ArticleModel.findOrCreate as jest.Mock).mockResolvedValueOnce([mockArticle, true]);
        (ArticleTagModel.bulkCreate as jest.Mock).mockRejectedValueOnce(new Error("bulkCreate failed"));

        await expect(CreateArticleService(input)).rejects.toThrow("bulkCreate failed");

        expect(articleCreatedHandler).not.toHaveBeenCalled();
    });
});
