import { Sequelize } from 'sequelize-typescript';
import Article from '@components/articles/models/Article';
import Tag from '@components/tags/models/Tag';
import ArticleTag from '@components/articles/models/ArticleTag';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'test',
    password: 'test',
    database: 'articles-platform-test-db',
    logging: false,
    models: [Article, Tag, ArticleTag],  // Регистрируем модели здесь
    define: {
        schema: 'public',       // Указываем схему, если используете не дефолтную
        underscored: true,      // Чтобы snake_case применялся по умолчанию
        timestamps: true,       // Чтобы createdAt/updatedAt создавались по умолчанию
    }
});

export default sequelize;