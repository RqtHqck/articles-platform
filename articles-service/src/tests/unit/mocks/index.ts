// __mocks__/setup.ts или в начале test файла
jest.mock('@components/articles/models', () => ({
    ArticleModel: { findOrCreate: jest.fn() },
    ArticleTagModel: { bulkCreate: jest.fn() },
}));

jest.mock('@components/tags/models', () => ({
    TagModel: { findAll: jest.fn() },
}));

jest.mock('@libs/kafka/producers/articles/articleCreatedHandler', () => jest.fn());

jest.mock('@libs/sequelize', () => ({
    transaction: jest.fn()
}));

jest.mock('@libs/logger', () => ({
    info: jest.fn(),
}));
