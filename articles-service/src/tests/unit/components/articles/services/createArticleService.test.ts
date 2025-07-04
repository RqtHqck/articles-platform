import {CreateArticleService} from "@components/articles/services";
import { ConflictError, BadRequestError } from '@errors/index';
import { ArticleModel, ArticleTagModel } from "@components/articles/models";
import { TagModel } from "@components/tags/models";
import { Model } from "sequelize";
import { Op } from 'sequelize';

// Мокируем методы моделей, чтобы не дергать реальную базу
jest.mock('@components/articles/models', () => ({
    Article: { findOrCreate: jest.fn() },
    ArticleTag: { bulkCreate: jest.fn() },
}));
jest.mock('@components/tags/models', () => ({
    Tag: { findAll: jest.fn() },
}));

// Получаем типобезопасные ссылки на моки, чтобы TS не ругался
const mockedArticle = ArticleModel as jest.Mocked<typeof ArticleModel>;
const mockedTag = TagModel as jest.Mocked<typeof TagModel>;
const mockedArticleTag = ArticleTagModel as jest.Mocked<typeof ArticleTagModel>;

describe("CreateArticleService", () => {
    // Входные данные
    const dto = { title: 'article title', content: 'article body', tags: [1, 2, 3] };

    afterEach(() => {
        // После каждого теста сброс моков, чтобы тесты были независимыми
        jest.clearAllMocks();
    });

    it("should create an article", async () => {
        // Формирую «фейковую» статью с минимальным набором полей и кастую в Model,
        // чтобы соответствовать возвращаемому типу Sequelize, не заморачиваясь с реальными инстансами
        const fakeArticle = { id: 2, title: dto.title, content: dto.content } as unknown as Model;

        // Мок Tag.findAll делаю так, чтобы он всегда возвращал все теги из dto
        mockedTag.findAll.mockResolvedValue(dto.tags.map(id => ({ id } as any)));

        // Мок Article.findOrCreate возвращает новую статью и флаг created=true, имитируя успешное создание
        mockedArticle.findOrCreate.mockResolvedValue([fakeArticle, true]);

        // bulkCreate тоже замокал просто на резолв без данных, нам важен факт вызова
        mockedArticleTag.bulkCreate.mockResolvedValue([]);

        // Вызываю сервис — это реальный вызов, но он работает с моками, без базы
        await CreateArticleService(dto);

        // Проверяю, что Tag.findAll вызвался с правильным условием по id с оператором Op.in
        expect(mockedTag.findAll).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    id: { [Op.in]: dto.tags },
                }),
            }),
        );
    });

    it('throws BadRequestError if some tag ids are invalid', async () => {
        // В этом тесте симулирую ситуацию, когда в базе меньше тегов, чем пришло на вход (2 вместо 3)
        mockedTag.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }] as any);

        // Проверяю, что сервис выбросит ошибку BadRequestError
        await expect(CreateArticleService(dto))
            .rejects
            .toBeInstanceOf(BadRequestError);

        // И при этом методы Article не должны вызываться, т.к. дальше по логике сервис не пойдёт
        expect(mockedArticle.findOrCreate).not.toHaveBeenCalled();
        expect(mockedArticleTag.bulkCreate).not.toHaveBeenCalled();
    });

    it('throws ConflictError if article title already exists', async () => {
        // В этом случае теги все есть
        mockedTag.findAll.mockResolvedValue(dto.tags.map(id => ({ id } as any)));

        // Но Article.findOrCreate возвращает created = false,
        // чтобы сервис понял, что статья с таким title уже существует и бросил ошибку
        mockedArticle.findOrCreate.mockResolvedValue([{} as unknown as Model, false]);

        await expect(CreateArticleService(dto))
            .rejects
            .toBeInstanceOf(ConflictError);

        // bulkCreate не должен вызываться, т.к. статья не создаётся
        expect(mockedArticleTag.bulkCreate).not.toHaveBeenCalled();
    });
});
