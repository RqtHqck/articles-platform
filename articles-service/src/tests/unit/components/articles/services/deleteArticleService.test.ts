// import { mockModels } from "../../../mocks";
// mockModels();
//
// const { DeleteArticleService } = require("@components/articles/services");
// const { ArticleModel, ArticleTagModel } = require("@components/articles/models");
// const { NotFoundError } = require('@errors/index');
// const articleDeletedHandler = require("@libs/kafka/producers/articles/articleDeletedHandler");
// const sequelize = require("@libs/sequelize");
//
// // Моки для моделей и зависимостей
// jest.mock("@components/articles/models", () => ({
//     ArticleModel: {
//         findByPk: jest.fn(),
//         destroy: jest.fn(),
//     },
//     ArticleTagModel: {
//         destroy: jest.fn(),
//     },
// }));
//
// // Исправленный мок для sequelize
// jest.mock("@libs/sequelize", () => ({
//     sequelize: {
//         transaction: jest.fn().mockImplementation(cb => cb({
//             commit: jest.fn(),
//             rollback: jest.fn(),
//         })),
//     },
// }));
//
// // Моки для Kafka
// jest.mock('kafkajs', () => ({
//     Kafka: jest.fn().mockImplementation(() => ({
//         producer: jest.fn(() => ({
//             connect: jest.fn().mockResolvedValue(undefined),
//             disconnect: jest.fn().mockResolvedValue(undefined),
//             send: jest.fn().mockResolvedValue(undefined),
//         })),
//     })),
// }));
//
// jest.mock("@libs/kafka/producers/articles/articleDeletedHandler", () => ({
//     articleDeletedHandler: jest.fn().mockResolvedValue(undefined),
// }));
//
// const mockedArticle = ArticleModel as jest.Mocked<typeof ArticleModel>;
// const mockedArticleTag = ArticleTagModel as jest.Mocked<typeof ArticleTagModel>;
// const mockedArticleDeletedHandler = articleDeletedHandler as jest.Mock;
//
// describe("DeleteArticleService", () => {
//     afterEach(() => {
//         jest.clearAllMocks();
//     });
//
//     it("should delete article and related tags successfully", async () => {
//         const foundArticle = { id: 123, title: "title", content: "content" };
//
//         mockedArticle.findByPk.mockResolvedValue({ id: foundArticle.id } as any);
//
//         (sequelize.transaction as jest.Mock).mockImplementation(async (cb) => {
//             return await cb();
//         });
//
//         mockedArticleTag.destroy.mockResolvedValue(1 as any);
//         mockedArticle.destroy.mockResolvedValue(1 as any);
//         mockedArticleDeletedHandler.mockResolvedValue(undefined);
//
//         await DeleteArticleService(foundArticle.id);
//
//         expect(mockedArticle.findByPk).toHaveBeenCalledWith(foundArticle.id);
//         expect(mockedArticleTag.destroy).toHaveBeenCalledWith({ where: { id: foundArticle.id } });
//         expect(mockedArticle.destroy).toHaveBeenCalledWith({ where: { id: foundArticle.id } });
//         expect(mockedArticleDeletedHandler).toHaveBeenCalledWith(foundArticle.id);
//     });
//
//     it("should throw NotFoundError if article does not exist", async () => {
//         const articleId = 999;
//
//         mockedArticle.findByPk.mockResolvedValue(null);
//
//         await expect(DeleteArticleService(articleId)).rejects.toThrow(NotFoundError);
//
//         expect(mockedArticleTag.destroy).not.toHaveBeenCalled();
//         expect(mockedArticle.destroy).not.toHaveBeenCalled();
//     });
// });
