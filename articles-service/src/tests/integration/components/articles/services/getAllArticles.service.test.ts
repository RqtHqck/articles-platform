import GetAllArticlesService from "@components/articles/services/getAllArticles.service";
import { ArticleModel, ArticleTagModel } from "@components/articles/models";
import { TagModel } from "@components/tags/models";
import sequelize from "@libs/sequelize";

describe("GetAllArticlesService (integration)", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    it("возвращает статьи с тегами и корректной пагинацией", async () => {
        const tag1 = await TagModel.create({ label: "tech" });
        const tag2 = await TagModel.create({ label: "science" });

        const article1 = await ArticleModel.create({ title: "Статья 1", content: "Контент 1" });
        const article2 = await ArticleModel.create({ title: "Статья 2", content: "Контент 2" });

        await ArticleTagModel.bulkCreate([
            { articleId: article1.id, tagId: tag1.id },
            { articleId: article2.id, tagId: tag2.id },
        ]);

        const result = await GetAllArticlesService({ limit: 10, page: 1 });

        expect(result.articles.length).toBe(2);
        expect(result.articles[0].tags[0].label).toBeDefined();
    });

    it("возвращает пустой список, если статей нет", async () => {
        const result = await GetAllArticlesService({ limit: 5, page: 1 });

        expect(result).toEqual({
            page: 1,
            limit: 5,
            offset: 0,
            articles: [],
        });
    });

    it("применяет корректный offset при пагинации", async () => {
        for (let i = 1; i <= 15; i++) {
            await ArticleModel.create({ title: `A${i}`, content: `C${i}` });
        }

        const result = await GetAllArticlesService({ limit: 5, page: 2 });

        expect(result.articles.length).toBe(5);
        expect(result.offset).toBe(5);
        expect(result.page).toBe(2);
    });
});
