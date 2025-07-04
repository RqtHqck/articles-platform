import { Article, ArticleTag } from "@components/articles/models";
import { Tag } from "@components/tags/models";
import {DeleteArticleService} from "@components/articles/services";
import NotFoundError from "@errors/NotFoundError";
import { initTestDB, cleanTestDB, closeTestDB } from '@tests/integration/sequelizeTestHelper';

beforeAll(async () => {
    await initTestDB();
});

beforeEach(async () => {
    await cleanTestDB();
});

afterAll(async () => {
    await closeTestDB();
});


describe("DeleteArticleService", () => {
    it("should delete article and its tags relations successfully", async () => {
        // Создаем статью и тег
        const tag = await Tag.create({ label: 'tech' });
        const article = await Article.create({ title: "To delete", content: "content" });

        // Создаем связь
        await ArticleTag.create({ articleId: article.id, tagId: tag.id });

        // Проверяем, что есть статья и связь
        let articleTags = await ArticleTag.findAll({ where: { articleId: article.id } });
        expect(articleTags.length).toBe(1);

        // Удаляем статью
        await DeleteArticleService(article.id);

        // Проверяем, что статья удалена
        const deletedArticle = await Article.findByPk(article.id);
        expect(deletedArticle).toBeNull();

        // Проверяем, что связи удалены
        articleTags = await ArticleTag.findAll({ where: { articleId: article.id } });
        expect(articleTags.length).toBe(0);
    });

    it("should throw NotFoundError if article does not exist", async () => {
        await expect(DeleteArticleService(9999)).rejects.toThrow(NotFoundError);
    });
});
