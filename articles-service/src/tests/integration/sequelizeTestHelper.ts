// import sequelize from './sequelize';
// import { ArticleModel, ArticleTagModel } from '@components/articles/models';
// import { TagModel } from '@components/tags/models';
//
// export async function initTestDB() {
//     await sequelize.authenticate();
//     await sequelize.drop();  // сброс базы полностью
//     await sequelize.sync();  // создание таблиц заново
// }
//
// export async function cleanTestDB() {
//     await ArticleTagModel.destroy({ where: {} }); // Сначала удаляем связи
//     await ArticleModel.destroy({ where: {} });    // Затем статьи
//     await TagModel.destroy({ where: {} });        // И только потом теги
// }
//
// export async function closeTestDB() {
//     await sequelize.close();
// }
