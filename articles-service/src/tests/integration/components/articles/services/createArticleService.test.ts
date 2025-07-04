import { Article, ArticleTag } from "@components/articles/models";
import { Tag } from "@components/tags/models";
import {CreateArticleService} from "@components/articles/services";
import { ConflictError, BadRequestError } from "@errors/index";
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
describe("CreateArticleService", () => {
    it("should create article with tags successfully", async () => {
        // Подготовка: создаём теги
        const tag1 = await Tag.create({ label: 'tech' });
        const tag2 = await Tag.create({ label: 'news' });

        const data = {
            title: "New Article",
            content: "Some content",
            tags: [tag1.id, tag2.id],
        };

        await CreateArticleService(data);

        // Проверяем, что статья создалась
        const article = await Article.findOne({ where: { title: data.title }, include: [Tag] });
        expect(article).not.toBeNull();
        expect(article!.content).toBe(data.content);

        // Проверяем связи с тегами
        const articleTags = await ArticleTag.findAll({ where: { articleId: article!.id } });
        expect(articleTags.length).toBe(2);
        const tagIds = articleTags.map(at => at.tagId);
        expect(tagIds).toContain(tag1.id);
        expect(tagIds).toContain(tag2.id);
    });

    it("should throw BadRequestError if some tags don't exist", async () => {
        // Создаём только один тег
        const tag1 = await Tag.create({ label: 'tech' });

        const data = {
            title: "Article with invalid tags",
            content: "Content",
            tags: [tag1.id, 9999], // 9999 - несуществующий тег
        };

        await expect(CreateArticleService(data)).rejects.toThrow(BadRequestError);
    });

    it("should throw ConflictError if article with same title exists", async () => {
        // Создаём тег для валидности
        const tag1 = await Tag.create({ label: 'tech' });

        // Создаём статью с таким же заголовком
        await Article.create({
            title: "Duplicate Title",
            content: "Content",
        });

        const data = {
            title: "Duplicate Title",
            content: "New content",
            tags: [tag1.id],
        };

        await expect(CreateArticleService(data)).rejects.toThrow(ConflictError);
    });
});
