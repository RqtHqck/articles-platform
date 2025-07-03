import { Sequelize } from 'sequelize-typescript';
import config from 'config';
import logger from '@libs/logger';
import {Article} from "@components/articles/models";
import {Tag} from "@components/tags/models";
import {ArticleTag} from "@components/articles/models";

const sequelize = new Sequelize(
    config.get<string>('DATABASE.NAME'),
    config.get<string>('DATABASE.USER'),
    config.get<string>('DATABASE.PASSWORD'),
    {
        host: config.get<string>('DATABASE.HOST'),
        dialect: config.get('DATABASE.DIALECT'),
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
        models: [Article, Tag, ArticleTag],
        logging: (msg: string) => logger.info(msg),
    }
);

sequelize
    .authenticate()
    .then(() => {
        logger.info(`Successful connect to database postgresql "${config.get<string>('DATABASE.NAME')}"`);
        return sequelize.sync({ force: false });
    })
    .then(() => {
        logger.info(`Successful synchronized with database postgresql`);
    })
    .catch((err: Error) => {
        logger.error(`Failed to connect to database "${config.get<string>('DATABASE.NAME')}": ${err.message}`);
    });

export default sequelize;
