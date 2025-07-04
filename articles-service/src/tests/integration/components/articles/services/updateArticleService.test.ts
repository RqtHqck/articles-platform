import { ArticleModel, ArticleTagModel } from '@components/articles/models';
import { TagModel } from '@components/tags/models';
import {UpdateArticleService} from '@components/articles/services';
import { NotFoundError, ConflictError, BadRequestError } from '@errors/index';
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


describe('UpdateArticleService – integration', () => {
    it('updates article, title/content & tag links', async () => {
        // ── Подготовка ────────────────────────────────────────
        const tagA = await TagModel.create({ label: 'tech' });
        const tagB = await TagModel.create({ label: 'news' });
        const tagC = await TagModel.create({ label: 'lifestyle' });

        const article = await ArticleModel.create({
            title: 'Old title',
            content: 'Old content',
        });

        // cвязь старого тега
        await ArticleTagModel.create({ articleId: article.id, tagId: tagA.id });

        // ── Вызываем сервис ───────────────────────────────────
        const dto = {
            title: 'New title',
            content: 'New content',
            tags: [tagB.id, tagC.id],
        };

        await UpdateArticleService(article.id, dto);

        // ── Проверяем результат ───────────────────────────────
        const updated = await ArticleModel.findByPk(article.id, { include: [TagModel] });
        expect(updated!.title).toBe('New title');
        expect(updated!.content).toBe('New content');

        const tagIds = updated!.tags.map(t => t.id).sort();
        expect(tagIds).toEqual([tagB.id, tagC.id].sort());
    });

    it('throws NotFoundError if article id is unknown', async () => {
        const tag = await TagModel.create({ label: 'tech' });

        await expect(
            UpdateArticleService(9999, {
                title: 'Whatever',
                content: 'Whatever',
                tags: [tag.id],
            })
        ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('throws ConflictError when title duplicates another article', async () => {
        const tag = await TagModel.create({ label: 'lifestyle' });

        // статья‑дубликат
        await ArticleModel.create({ title: 'Unique', content: 'x' });

        const main = await ArticleModel.create({ title: 'Main', content: 'y' });

        await expect(
            UpdateArticleService(main.id, {
                title: 'Unique',          // дублируем
                content: 'zzz',
                tags: [tag.id],
            })
        ).rejects.toBeInstanceOf(ConflictError);
    });

    it('throws BadRequestError if some tag ids are invalid', async () => {
        const validTag = await TagModel.create({ label: 'tech' });
        const art = await ArticleModel.create({ title: 'T', content: 'C' });

        await expect(
            UpdateArticleService(art.id, {
                title: 'T updated',
                content: 'C updated',
                tags: [validTag.id, 9999],   // 9999 не существует
            })
        ).rejects.toBeInstanceOf(BadRequestError);
    });
});
