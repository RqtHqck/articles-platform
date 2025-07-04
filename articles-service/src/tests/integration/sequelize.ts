import { Sequelize } from 'sequelize-typescript';
import ArticleModel from '@components/articles/models/Article.model';
import TagModel from '@components/tags/models/Tag.model';
import ArticleTagModel from '@components/articles/models/ArticleTag.model';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'test',
    password: 'test',
    database: 'articles-platform-test-db',
    logging: false,
    models: [ArticleModel, TagModel, ArticleTagModel],  // Регистрируем модели здесь
    define: {
        schema: 'public',       // Указываем схему, если используете не дефолтную
        underscored: true,      // Чтобы snake_case применялся по умолчанию
        timestamps: true,       // Чтобы createdAt/updatedAt создавались по умолчанию
    }
});

export default sequelize;