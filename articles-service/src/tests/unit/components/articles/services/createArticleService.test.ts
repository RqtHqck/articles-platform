import CreateArticleService from '@components/articles/services/createArticle.service';
import { ArticleModel, ArticleTagModel } from '@components/articles/models';
import { TagModel } from '@components/tags/models';
import articleCreatedHandler from '@libs/kafka/producers/articles/articleCreatedHandler';
import sequelize from '@libs/sequelize';
import { ConflictError, BadRequestError } from '@errors/index';

const mockTransaction = jest.fn();

describe('CreateArticleService', () => {
    const createData = {
        title: 'Test Article',
        content: 'Test Content',
        tags: [1, 2],
    };

    const mockTags = [
        { id: 1, label: 'Tag1' },
        { id: 2, label: 'Tag2' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        // mock sequelize transaction
        (sequelize.transaction as jest.Mock).mockImplementation(async (cb) => {
            return cb(mockTransaction);
        });

        // mock tag findAll
        (TagModel.findAll as jest.Mock).mockResolvedValue(mockTags);
    });

    it('should successfully create an article and produce event', async () => {
        const mockArticle = {
            id: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
            publishedAt: new Date(),
        };

        (ArticleModel.findOrCreate as jest.Mock).mockResolvedValue([mockArticle, true]);
        (ArticleTagModel.bulkCreate as jest.Mock).mockResolvedValue(undefined);

        await expect(CreateArticleService(createData)).resolves.toBeUndefined();

        expect(TagModel.findAll).toHaveBeenCalledWith({
            where: { id: { [expect.any(Symbol)]: [1, 2] } },
        });

        expect(ArticleModel.findOrCreate).toHaveBeenCalledWith({
            where: { title: 'Test Article' },
            defaults: { title: 'Test Article', content: 'Test Content' },
            transaction: mockTransaction,
        });

        expect(ArticleTagModel.bulkCreate).toHaveBeenCalledWith(
            [{ articleId: 10, tagId: 1 }, { articleId: 10, tagId: 2 }],
            { ignoreDuplicates: true, transaction: mockTransaction }
        );

        expect(articleCreatedHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 10,
                title: 'Test Article',
                tags: mockTags.map(t => ({ id: t.id, label: t.label })),
            })
        );
    });

    it('should throw BadRequestError for invalid tag ids', async () => {
        (TagModel.findAll as jest.Mock).mockResolvedValue([mockTags[0]]); // только один tag

        await expect(CreateArticleService(createData)).rejects.toThrow(BadRequestError);

        expect(ArticleModel.findOrCreate).not.toHaveBeenCalled();
        expect(articleCreatedHandler).not.toHaveBeenCalled();
    });

    it('should throw ConflictError if article already exists', async () => {
        const existingArticle = {
            id: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
            publishedAt: new Date(),
        };

        (ArticleModel.findOrCreate as jest.Mock).mockResolvedValue([existingArticle, false]);

        await expect(CreateArticleService(createData)).rejects.toThrow(ConflictError);

        expect(articleCreatedHandler).not.toHaveBeenCalled();
    });

    it('should throw if sequelize transaction fails', async () => {
        (sequelize.transaction as jest.Mock).mockImplementation(async () => {
            throw new Error('Transaction failed');
        });

        await expect(CreateArticleService(createData)).rejects.toThrow('Transaction failed');
    });

    it('should not call kafka producer if article not created', async () => {
        (ArticleModel.findOrCreate as jest.Mock).mockResolvedValue([{ id: 1 }, false]);

        await expect(CreateArticleService(createData)).rejects.toThrow(ConflictError);

        expect(articleCreatedHandler).not.toHaveBeenCalled();
    });
});
