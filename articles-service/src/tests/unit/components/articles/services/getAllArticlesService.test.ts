import {GetAllArticlesService} from "@components/articles/services";
import { Article } from "@components/articles/models";
import { Tag } from "@components/tags/models";

jest.mock("@components/articles/models", () => ({
    Article: { findAll: jest.fn() },
}));
jest.mock("@components/tags/models", () => ({
    Tag: jest.fn(), // модель нам нужна просто для include, она не используется напрямую
}));

const mockedArticle = Article as jest.Mocked<typeof Article>;

describe("GetAllArticlesService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return paginated articles with tags", async () => {
        const limit = 5;
        const page = 2;
        const offset = (page - 1) * limit;

        // Мокаем findAll, чтобы вернуть фейковые статьи с тегами
        const fakeArticles = [
            {
                id: 1,
                title: "Test article",
                content: "Content",
                Tags: [{ id: 1, label: "tech" }],
            },
            {
                id: 2,
                title: "Another article",
                content: "More content",
                Tags: [{ id: 2, label: "news" }],
            },
        ];

        mockedArticle.findAll.mockResolvedValue(fakeArticles as any);

        const result = await GetAllArticlesService({ limit, page });

        // Проверяем, что findAll вызвался с правильными параметрами
        expect(mockedArticle.findAll).toHaveBeenCalledWith({
            limit,
            offset,
            include: [{ model: Tag }],
        });

        // Проверяем, что возвращаемые данные соответствуют ожиданиям
        expect(result).toEqual({
            page,
            limit,
            offset,
            articles: fakeArticles,
        });
    });

    it("should handle page = 1 correctly", async () => {
        const limit = 5;
        const page = 1;
        const offset = 0; // (1 - 1) * 5 = 0

        mockedArticle.findAll.mockResolvedValue([]);

        const result = await GetAllArticlesService({ limit, page });

        expect(mockedArticle.findAll).toHaveBeenCalledWith({
            limit,
            offset,
            include: [{ model: Tag }],
        });

        expect(result.page).toBe(1);
        expect(result.offset).toBe(0);
    });

    it("should handle limit = 0 correctly", async () => {
        const limit = 0; // возможно, бизнес-логика не допускает 0, но тестируем на всякий
        const page = 2;
        const offset = (page - 1) * limit; // 0

        mockedArticle.findAll.mockResolvedValue([]);

        const result = await GetAllArticlesService({ limit, page });

        expect(mockedArticle.findAll).toHaveBeenCalledWith({
            limit,
            offset,
            include: [{ model: Tag }],
        });

        expect(result.limit).toBe(0);
        expect(result.offset).toBe(0);
    });

    it("should handle page less than 1 (e.g. 0) gracefully", async () => {
        const limit = 5;
        const page = 0; // некорректное значение
        const offset = (page - 1) * limit; // -5

        mockedArticle.findAll.mockResolvedValue([]);

        const result = await GetAllArticlesService({ limit, page });

        expect(mockedArticle.findAll).toHaveBeenCalledWith({
            limit,
            offset,
            include: [{ model: Tag }],
        });

        expect(result.page).toBe(0);
        expect(result.offset).toBe(offset);
    });
    // Дополнительно можно проверить граничные случаи, например page=1, limit=0 (если это актуально)
});
