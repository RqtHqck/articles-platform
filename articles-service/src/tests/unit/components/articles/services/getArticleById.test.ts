import {GetArticleByIdService} from "@components/articles/services";
import { ArticleModel } from "@components/articles/models";
import { NotFoundError } from '@errors/index';

jest.mock("@components/articles/models", () => ({
    Article: {
        findByPk: jest.fn(),
    },
}));

const mockedArticle = ArticleModel as jest.Mocked<typeof ArticleModel>;

describe("GetArticleByIdService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return article if found", async () => {
        const articleId = 1;
        const fakeArticle = { id: articleId, title: "title", content: "content" };

        mockedArticle.findByPk.mockResolvedValue(fakeArticle as any);

        const result = await GetArticleByIdService(articleId);

        expect(mockedArticle.findByPk).toHaveBeenCalledWith(articleId);
        expect(result).toEqual(fakeArticle);
    });

    it("should throw NotFoundError if article not found", async () => {
        const articleId = 2;

        mockedArticle.findByPk.mockResolvedValue(null);

        await expect(GetArticleByIdService(articleId)).rejects.toThrow(NotFoundError);

        expect(mockedArticle.findByPk).toHaveBeenCalledWith(articleId);
    });
});
