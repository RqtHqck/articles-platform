import sequelize from "@libs/sequelize";
import kafka from "@libs/kafka/kafka";
import {ArticleModel, ArticleTagModel} from "@components/articles/models";
import {TagModel} from "@components/tags/models";
import {DeleteArticleService} from "@components/articles/services";
import {NotFoundError} from "@errors/index";
import articleDeletedHandler from "@libs/kafka/producers/articles/articleDeletedHandler";

jest.mock("@libs/kafka/producers/articles/articleDeletedHandler", () => ({
    __esModule: true,
    default: jest.fn(),
}));


describe("Удаление статьи", () => {
    let articleId: number;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        const tag = await TagModel.create({ label: "tech" });

        const article = await ArticleModel.create({
            title: "Test Article",
            content: "Some content",
        });

        articleId = article.id;


        await ArticleTagModel.create({
            articleId: article.id,
            tagId: tag.id,
        });

        jest.clearAllMocks();
    });

    afterEach(async () => {
        await ArticleTagModel.destroy({ where: {} });
        await ArticleModel.destroy({ where: {} });
        await TagModel.destroy({ where: {} });
    });

    it("должен удалить статью и связанные теги", async () => {
        await DeleteArticleService(articleId);

        const article = await ArticleModel.findByPk(articleId);
        expect(article).toBeNull();

        const tags = await ArticleTagModel.findAll({ where: { articleId } });
        expect(tags.length).toBe(0);

        expect(articleDeletedHandler).toHaveBeenCalledWith(articleId);
    });

    it("должен выбросить NotFoundError, если статья не найдена", async () => {
        articleId = 99999;
        await expect(DeleteArticleService(articleId)).rejects.toThrow(NotFoundError);
    });

    it("не вызывает articleDeletedHandler, если transaction упала", async () => {
        const spy = jest.spyOn(ArticleModel, 'destroy').mockImplementationOnce(() => {
            throw new Error("Ошибка внутри транзакции");
        });

        await expect(DeleteArticleService(articleId)).rejects.toThrow("Ошибка внутри транзакции");
        expect(articleDeletedHandler).not.toHaveBeenCalled();

        spy.mockRestore();
    });
})