import { Article, ArticleTag } from "@components/articles/models";
import { GetArticleByIdService } from "@components/articles/services";
import { NotFoundError } from "@errors/index";

import { Sequelize } from 'sequelize-typescript';
import { Tag } from "@components/tags/models";

const sequelize = new Sequelize('articles-platform-test-db', 'test', 'test', {
    host: 'localhost',
    port: 5433,
    dialect: 'postgres',
    logging: console.log,
    models: [Article, Tag, ArticleTag],
});

// Опциональная проверка соединения
beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await Article.destroy({ where: {} });
});

describe("GetArticleByIdService", () => {
    it("should return article by id", async () => {
        const createdArticle = await Article.create({
            title: "Test Article",
            content: "Test content",
        });

        const result = await GetArticleByIdService(createdArticle.id);

        expect(result.id).toBe(createdArticle.id);
        expect(result.title).toBe("Test Article");
    });

    it("should throw NotFoundError if article not found", async () => {
        await expect(GetArticleByIdService(9999)).rejects.toThrow(NotFoundError);
    });
});
