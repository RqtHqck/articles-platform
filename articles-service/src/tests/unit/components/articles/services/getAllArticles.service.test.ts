import GetAllArticlesService from "@components/articles/services/getAllArticles.service";
import { ArticleModel } from "@components/articles/models";
import { TagModel } from "@components/tags/models";

jest.mock("@components/articles/models");
jest.mock("@components/tags/models");

describe("GetAllArticlesService (unit)", () => {
    it("должен вернуть статьи с пагинацией", async () => {
        const mockArticles = [
            {
                id: 1,
                title: "Статья 1",
                tags: [{ id: 1, label: "tag1" }]
            },
            {
                id: 2,
                title: "Статья 2",
                tags: [{ id: 2, label: "tag2" }]
            }
        ];

        // @ts-ignore
        ArticleModel.findAll.mockResolvedValue(mockArticles);

        const result = await GetAllArticlesService({ limit: 10, page: 2 });

        expect(ArticleModel.findAll).toHaveBeenCalledWith({
            limit: 10,
            offset: 10,
            include: [{ model: TagModel }],
        });

        expect(result).toEqual({
            page: 2,
            limit: 10,
            offset: 10,
            articles: mockArticles
        });
    });

    it("должен вернуть пустой список, если статей нет", async () => {
        // @ts-ignore
        ArticleModel.findAll.mockResolvedValue([]);

        const result = await GetAllArticlesService({ limit: 5, page: 1 });

        expect(ArticleModel.findAll).toHaveBeenCalledWith({
            limit: 5,
            offset: 0,
            include: [{ model: TagModel }],
        });

        expect(result).toEqual({
            page: 1,
            limit: 5,
            offset: 0,
            articles: []
        });
    });

});
