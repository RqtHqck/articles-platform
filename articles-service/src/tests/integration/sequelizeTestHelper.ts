import sequelize from './sequelize';
import { Article, ArticleTag } from '@components/articles/models';
import { Tag } from '@components/tags/models';

export async function initTestDB() {
    await sequelize.authenticate();
    await sequelize.drop();  // сброс базы полностью
    await sequelize.sync();  // создание таблиц заново
}

export async function cleanTestDB() {
    await ArticleTag.destroy({ where: {} }); // Сначала удаляем связи
    await Article.destroy({ where: {} });    // Затем статьи
    await Tag.destroy({ where: {} });        // И только потом теги
}

export async function closeTestDB() {
    await sequelize.close();
}
