import {UpdateArticleService} from "../../services";
import { Article, ArticleTag } from "../../models";
import { Tag } from "../../../tags/models";
import { Op } from "sequelize";
import { NotFoundError, ConflictError, BadRequestError } from "../../../../errors/index";

jest.mock("../../models", () => ({
    Article: {
        findByPk: jest.fn(),
        findOne: jest.fn(),
    },
    ArticleTag: {
        destroy: jest.fn(),
        bulkCreate: jest.fn(),
    },
}));
jest.mock("../../../tags/models", () => ({
    Tag: {
        findAll: jest.fn(),
    },
}));

const mockedArticle = Article as jest.Mocked<typeof Article>;
const mockedArticleTag = ArticleTag as jest.Mocked<typeof ArticleTag>;
const mockedTag = Tag as jest.Mocked<typeof Tag>;

describe("UpdateArticleService", () => {
    const id = 1;
    const dto = { title: "new title", content: "new content", tags: [1, 2] };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should update article successfully", async () => {
        const fakeArticle = {
            id,
            update: jest.fn().mockResolvedValue(undefined),
        } as any;

        mockedArticle.findByPk.mockResolvedValue(fakeArticle);
        mockedArticle.findOne.mockResolvedValue(null);
        mockedTag.findAll.mockResolvedValue(dto.tags.map(id => ({ id } as any)));
        mockedArticleTag.destroy.mockResolvedValue(1 as any);
        mockedArticleTag.bulkCreate.mockResolvedValue([]);

        await UpdateArticleService(id, dto);

        expect(mockedArticle.findByPk).toHaveBeenCalledWith(id);
        expect(mockedArticle.findOne).toHaveBeenCalledWith({
            where: { title: dto.title, id: { [Op.ne]: id } },
        });
        expect(mockedTag.findAll).toHaveBeenCalledWith({
            where: { id: { [Op.in]: dto.tags } },
        });
        expect(fakeArticle.update).toHaveBeenCalledWith({ title: dto.title, content: dto.content });
        expect(mockedArticleTag.destroy).toHaveBeenCalledWith({ where: { articleId: id } });
        expect(mockedArticleTag.bulkCreate).toHaveBeenCalledWith(
            dto.tags.map(tagId => ({ articleId: id, tagId }))
        );
    });

    it("should throw NotFoundError if article not found", async () => {
        mockedArticle.findByPk.mockResolvedValue(null);

        await expect(UpdateArticleService(id, dto)).rejects.toThrow(NotFoundError);

        expect(mockedArticle.findOne).not.toHaveBeenCalled();
        expect(mockedTag.findAll).not.toHaveBeenCalled();
        expect(mockedArticleTag.destroy).not.toHaveBeenCalled();
    });

    it("should throw ConflictError if duplicate title exists", async () => {
        const fakeArticle = { id, update: jest.fn() } as any;
        mockedArticle.findByPk.mockResolvedValue(fakeArticle);
        mockedArticle.findOne.mockResolvedValue({ id: 999 } as any);

        await expect(UpdateArticleService(id, dto)).rejects.toThrow(ConflictError);

        expect(mockedTag.findAll).not.toHaveBeenCalled();
        expect(fakeArticle.update).not.toHaveBeenCalled();
        expect(mockedArticleTag.destroy).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if some tags not found", async () => {
        const fakeArticle = { id, update: jest.fn() } as any;
        mockedArticle.findByPk.mockResolvedValue(fakeArticle);
        mockedArticle.findOne.mockResolvedValue(null);
        // Возвращаем меньше тегов, чем передано
        mockedTag.findAll.mockResolvedValue([{ id: dto.tags[0] }] as any);

        await expect(UpdateArticleService(id, dto)).rejects.toThrow(BadRequestError);

        expect(fakeArticle.update).not.toHaveBeenCalled();
        expect(mockedArticleTag.destroy).not.toHaveBeenCalled();
    });
});
