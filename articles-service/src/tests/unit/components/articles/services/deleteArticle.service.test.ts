import DeleteArticleService from "@components/articles/services/deleteArticle.service";
import { ArticleModel, ArticleTagModel } from "@components/articles/models";
import articleDeletedHandler from "@libs/kafka/producers/articles/articleDeletedHandler";
import sequelize from "@libs/sequelize";
import NotFoundError from "@errors/NotFoundError";

jest.mock("@components/articles/models", () => ({
    ArticleModel: {
        findByPk: jest.fn(),
        destroy: jest.fn(),
    },
    ArticleTagModel: {
        destroy: jest.fn(),
    },
}));

jest.mock("@libs/kafka/producers/articles/articleDeletedHandler", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("@libs/sequelize", () => ({
    transaction: jest.fn((cb) => cb({})),
}));

describe("DeleteArticleService (unit)", () => {
    const mockArticle = { id: 1 };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("удаляет статью и связи, вызывает articleDeletedHandler", async () => {
        (ArticleModel.findByPk as jest.Mock).mockResolvedValueOnce(mockArticle);
        (ArticleTagModel.destroy as jest.Mock).mockResolvedValueOnce(1);
        (ArticleModel.destroy as jest.Mock).mockResolvedValueOnce(1);

        await DeleteArticleService(1);

        expect(ArticleModel.findByPk).toHaveBeenCalledWith(1);
        expect(ArticleTagModel.destroy).toHaveBeenCalledWith({ where: { articleId: 1 }, transaction: {} });
        expect(ArticleModel.destroy).toHaveBeenCalledWith({ where: { id: 1 }, transaction: {} });
        expect(articleDeletedHandler).toHaveBeenCalledWith(1);
    });

    it("выбрасывает NotFoundError, если статья не найдена", async () => {
        (ArticleModel.findByPk as jest.Mock).mockResolvedValueOnce(null);

        await expect(DeleteArticleService(999)).rejects.toThrow(NotFoundError);

        expect(ArticleTagModel.destroy).not.toHaveBeenCalled();
        expect(ArticleModel.destroy).not.toHaveBeenCalled();
        expect(articleDeletedHandler).not.toHaveBeenCalled();
    });

    it("прокидывает ошибку, если что-то падает внутри транзакции", async () => {
        (ArticleModel.findByPk as jest.Mock).mockResolvedValueOnce(mockArticle);
        (ArticleTagModel.destroy as jest.Mock).mockImplementationOnce(() => {
            throw new Error("Ошибка при удалении связей");
        });

        await expect(DeleteArticleService(1)).rejects.toThrow("Ошибка при удалении связей");

        expect(ArticleModel.destroy).not.toHaveBeenCalled();
        expect(articleDeletedHandler).not.toHaveBeenCalled();
    });
});
