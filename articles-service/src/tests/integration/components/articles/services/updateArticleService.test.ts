import { Article, ArticleTag } from '@components/articles/models';
import { Tag } from '@components/tags/models';
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
        const tagA = await Tag.create({ label: 'tech' });
        const tagB = await Tag.create({ label: 'news' });
        const tagC = await Tag.create({ label: 'lifestyle' });

        const article = await Article.create({
            title: 'Old title',
            content: 'Old content',
        });

        // cвязь старого тега
        await ArticleTag.create({ articleId: article.id, tagId: tagA.id });

        // ── Вызываем сервис ───────────────────────────────────
        const dto = {
            title: 'New title',
            content: 'New content',
            tags: [tagB.id, tagC.id],
        };

        await UpdateArticleService(article.id, dto);

        // ── Проверяем результат ───────────────────────────────
        const updated = await Article.findByPk(article.id, { include: [Tag] });
        expect(updated!.title).toBe('New title');
        expect(updated!.content).toBe('New content');

        const tagIds = updated!.tags.map(t => t.id).sort();
        expect(tagIds).toEqual([tagB.id, tagC.id].sort());
    });

    it('throws NotFoundError if article id is unknown', async () => {
        const tag = await Tag.create({ label: 'tech' });

        await expect(
            UpdateArticleService(9999, {
                title: 'Whatever',
                content: 'Whatever',
                tags: [tag.id],
            })
        ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('throws ConflictError when title duplicates another article', async () => {
        const tag = await Tag.create({ label: 'lifestyle' });

        // статья‑дубликат
        await Article.create({ title: 'Unique', content: 'x' });

        const main = await Article.create({ title: 'Main', content: 'y' });

        await expect(
            UpdateArticleService(main.id, {
                title: 'Unique',          // дублируем
                content: 'zzz',
                tags: [tag.id],
            })
        ).rejects.toBeInstanceOf(ConflictError);
    });

    it('throws BadRequestError if some tag ids are invalid', async () => {
        const validTag = await Tag.create({ label: 'tech' });
        const art = await Article.create({ title: 'T', content: 'C' });

        await expect(
            UpdateArticleService(art.id, {
                title: 'T updated',
                content: 'C updated',
                tags: [validTag.id, 9999],   // 9999 не существует
            })
        ).rejects.toBeInstanceOf(BadRequestError);
    });
});
