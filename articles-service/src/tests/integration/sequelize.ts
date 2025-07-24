import { Sequelize } from 'sequelize-typescript';
import ArticleModel from '@components/articles/models/Article.model';
import TagModel from '@components/tags/models/Tag.model';
import ArticleTagModel from '@components/articles/models/ArticleTag.model';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    logging: false,
    models: [ArticleModel, TagModel, ArticleTagModel],  // Регистрируем модели здесь
    define: {
        schema: 'public',       // Указываем схему, если используете не дефолтную
        underscored: true,      // Чтобы snake_case применялся по умолчанию
        timestamps: true,       // Чтобы createdAt/updatedAt создавались по умолчанию
    }
});

export default sequelize;