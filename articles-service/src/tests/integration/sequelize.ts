import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import ArticleModel from '@components/articles/models/Article.model';
import TagModel from '@components/tags/models/Tag.model';
import ArticleTagModel from '@components/articles/models/ArticleTag.model';

const sequelizeOptions: SequelizeOptions = {
    dialect: 'postgres',
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    logging: false,
    models: [ArticleModel, TagModel, ArticleTagModel],
}

const sequelize = new Sequelize(sequelizeOptions);

export default sequelize;