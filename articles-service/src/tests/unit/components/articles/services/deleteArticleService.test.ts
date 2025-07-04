import {DeleteArticleService} from "@components/articles/services";
import { ArticleModel, ArticleTagModel } from "@components/articles/models";
import { NotFoundError } from '@errors/index';

jest.mock("@components/articles/models", () => ({
    Article: {
        findByPk: jest.fn(),
        destroy: jest.fn(),
    },
    ArticleTag: {
        destroy: jest.fn(),
    },
}));

const mockedArticle = ArticleModel as jest.Mocked<typeof ArticleModel>;
const mockedArticleTag = ArticleTagModel as jest.Mocked<typeof ArticleTagModel>;

describe("DeleteArticleService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should delete article and related tags successfully", async () => {
        const articleId = 123;

        mockedArticle.findByPk.mockResolvedValue({ id: articleId } as any);
        mockedArticleTag.destroy.mockResolvedValue(1 as any);
        mockedArticle.destroy.mockResolvedValue(1 as any);

        await DeleteArticleService(articleId);

        expect(mockedArticle.findByPk).toHaveBeenCalledWith(articleId);
        expect(mockedArticleTag.destroy).toHaveBeenCalledWith({ where: { articleId } });
        expect(mockedArticle.destroy).toHaveBeenCalledWith({ where: { id: articleId } });
    });

    it("should throw NotFoundError if article does not exist", async () => {
        const articleId = 999;

        mockedArticle.findByPk.mockResolvedValue(null);

        await expect(DeleteArticleService(articleId)).rejects.toThrow(NotFoundError);

        expect(mockedArticleTag.destroy).not.toHaveBeenCalled();
        expect(mockedArticle.destroy).not.toHaveBeenCalled();
    });
});
