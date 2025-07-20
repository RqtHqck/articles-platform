import { Sequelize } from 'sequelize-typescript';
import logger from '@libs/logger';
import {ArticleModel} from "@components/articles/models";
import {TagModel} from "@components/tags/models";
import {ArticleTagModel} from "@components/articles/models";

const sequelize = new Sequelize(
    process.env.POSTGRES_DB!,
    process.env.POSTGRES_USER!,
    process.env.POSTGRES_PASSWORD!,
    {
        host: process.env.DB_HOST!,
        dialect: 'postgres',
        timezone: '+03:00',
        pool: {
            max: 5,
            min: 0,
            acquire: 10000,
            idle: 10000,
        },
        retry: {
            max: 3,
        },
        models: [ArticleModel, TagModel, ArticleTagModel],
        logging: (msg: string) => logger.info(msg),
    }
);

sequelize
    .authenticate()
    .then(() => {
        logger.info(`Successful connect to database postgresql "${process.env.POSTGRES_DB!}"`);
        return sequelize.sync({ force: false });
    })
    .then(() => {
        logger.info(`Successful synchronized with database postgresql`);
    })
    .catch((err: Error) => {
        logger.error(`Failed to connect to database "${process.env.POSTGRES_DB!}": ${err.message}`);
    });

export default sequelize;
