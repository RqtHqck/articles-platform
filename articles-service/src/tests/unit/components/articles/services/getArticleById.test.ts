// import {GetArticleByIdService} from "@components/articles/services";
// import { ArticleModel } from "@components/articles/models";
// import { NotFoundError } from '@errors/index';
//
// jest.mock("@components/articles/models", () => ({
//     ArticleModel: {
//         findByPk: jest.fn(),
//     },
// }));
//
// const mockedArticle = ArticleModel as jest.Mocked<typeof ArticleModel>;
//
// describe("GetArticleByIdService", () => {
//     afterEach(() => {
//         jest.clearAllMocks();
//     });
//
//     it("should return article", async () => {
//         const fakeArticle = {
//             id: 123,
//             title: "title",
//             content: "content",
//             publishedAt: new Date(),
//             updatedAt: new Date()
//         };
//         mockedArticle.findByPk.mockResolvedValue(fakeArticle as unknown as ArticleModel);
//
//         const result = await GetArticleByIdService(fakeArticle.id);
//
//         expect(mockedArticle.findByPk).toHaveBeenCalledWith(fakeArticle.id);
//         expect(result).toEqual(fakeArticle);
//     });
//
//     it("should throw NotFoundError if article not found", async () => {
//         const articleId = 2;
//
//         mockedArticle.findByPk.mockResolvedValue(null);
//
//         await expect(GetArticleByIdService(articleId)).rejects.toThrow(NotFoundError);
//
//         expect(mockedArticle.findByPk).toHaveBeenCalledWith(articleId);
//     });
// });
