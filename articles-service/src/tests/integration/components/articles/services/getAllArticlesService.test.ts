import { Article, ArticleTag } from "@components/articles/models";
import { Tag } from "@components/tags/models";
import {GetAllArticlesService} from "@components/articles/services";
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

describe("GetAllArticlesService", () => {
    it("should return paginated articles with tags", async () => {
        // Создаем теги
        const tag1 = await Tag.create({ label: "tech" });
        const tag2 = await Tag.create({ label: "lifestyle" });

        // Создаем статьи
        const article1 = await Article.create({ title: "Article 1", content: "Content 1" });
        const article2 = await Article.create({ title: "Article 2", content: "Content 2" });
        const article3 = await Article.create({ title: "Article 3", content: "Content 3" });

        // Связываем теги и статьи
        await article1.$add('tags', [tag1]);
        await article2.$add('tags', [tag2]);
        await article3.$add('tags', [tag1, tag2]);

        // Запрос с пагинацией: limit 2, page 1
        const resultPage1 = await GetAllArticlesService({ limit: 2, page: 1 });

        expect(resultPage1.page).toBe(1);
        expect(resultPage1.limit).toBe(2);
        expect(resultPage1.offset).toBe(0);
        expect(resultPage1.articles.length).toBe(2);

        // Проверяем, что в статье есть теги (с маленькой буквы 'tags')
        expect(resultPage1.articles[0].tags).toBeDefined();
        expect(resultPage1.articles[0].tags.length).toBeGreaterThanOrEqual(1);

        // Запрос с пагинацией: limit 2, page 2
        const resultPage2 = await GetAllArticlesService({ limit: 2, page: 2 });

        expect(resultPage2.page).toBe(2);
        expect(resultPage2.limit).toBe(2);
        expect(resultPage2.offset).toBe(2);
        expect(resultPage2.articles.length).toBe(1); // Третий элемент
    });
});
