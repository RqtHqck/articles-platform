import { ArticleModel, ArticleTagModel } from "@components/articles/models";
import { GetArticleByIdService } from "@components/articles/services";
import { NotFoundError } from "@errors/index";
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

describe("GetArticleByIdService", () => {
    it("should return article by id", async () => {
        const createdArticle = await ArticleModel.create({
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
