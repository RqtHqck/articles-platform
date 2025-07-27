import kafka from "@libs/kafka/kafka";
import CreateArticleService from "@components/articles/services/createArticle.service";
import { ArticleModel, ArticleTagModel } from "@components/articles/models";
import { TagModel } from "@components/tags/models";
import { BadRequestError, ConflictError } from "@errors/index";
import articleCreatedHandler from "@libs/kafka/producers/articles/articleCreatedHandler";
import sequelize from "@libs/sequelize";
import { ICreateArticleDto } from "@entities/interfaces";

jest.mock("@libs/kafka/producers/articles/articleCreatedHandler", () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe("Create article", () => {
    const validTags = [
        { id: 1, label: "tech" },
        { id: 2, label: "science" },
    ];

    const createDto: ICreateArticleDto = {
        title: "New Article",
        content: "Some content",
        tags: [1, 2],
    };

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        jest.clearAllMocks();

        await TagModel.bulkCreate(validTags);
    });

    afterEach(async () => {
        await ArticleTagModel.destroy({ where: {} });
        await ArticleModel.destroy({ where: {} });
        await TagModel.destroy({ where: {} });
    });

    it("успешно создаёт статью и вызывает articleCreatedHandler", async () => {
        await CreateArticleService(createDto);

        const article = await ArticleModel.findOne({ where: { title: createDto.title } });
        expect(article).not.toBeNull();

        const articleTags = await ArticleTagModel.findAll({ where: { articleId: article!.id } });
        expect(articleTags.length).toBe(2);

        expect(articleCreatedHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                id: article!.id,
                title: createDto.title,
                content: createDto.content,
                tags: expect.arrayContaining([
                    expect.objectContaining({ id: 1, label: "tech" }),
                    expect.objectContaining({ id: 2, label: "science" }),
                ]),
            })
        );
    });

    it("выкидывает BadRequestError, если тегов не существует", async () => {
        await TagModel.destroy({ where: {} }); // Удаляем все теги

        await expect(CreateArticleService(createDto)).rejects.toThrow(BadRequestError);

        const articles = await ArticleModel.findAll();
        expect(articles.length).toBe(0);

        expect(articleCreatedHandler).not.toHaveBeenCalled();
    });

    it("выкидывает ConflictError, если статья с таким title уже существует", async () => {
        // Сначала создаём статью
        await CreateArticleService(createDto);

        // Пытаемся создать такую же снова
        await expect(CreateArticleService(createDto)).rejects.toThrow(ConflictError);

        // Убедимся, что вторая статья не создана
        const articles = await ArticleModel.findAll({ where: { title: createDto.title } });
        expect(articles.length).toBe(1); // Только одна
    });

    it("не вызывает articleCreatedHandler, если статья уже существует", async () => {
        await CreateArticleService(createDto);
        jest.clearAllMocks();

        await expect(CreateArticleService(createDto)).rejects.toThrow(ConflictError);
        expect(articleCreatedHandler).not.toHaveBeenCalled();
    });

    it("не вызывает articleCreatedHandler, если transaction упала", async () => {
        const spy = jest.spyOn(ArticleModel, 'findOrCreate').mockImplementationOnce(() => {
            throw new Error("Ошибка внутри транзакции");
        });

        await expect(CreateArticleService(createDto)).rejects.toThrow("Ошибка внутри транзакции");
        expect(articleCreatedHandler).not.toHaveBeenCalled();
    });
})
