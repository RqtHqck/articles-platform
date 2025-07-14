import config from 'config';
import logger from '@libs/logger';
import kafka from '@libs/kafka/kafka';
import {IArticleUpdatedEvent} from "@entities/interfaces";

export default async function articleUpdatedHandler(articleDto: IArticleUpdatedEvent): Promise<void> {
    try {
        const message = {
            key: null,
            value: {
                ...articleDto
            },
        };

        await kafka.produce(config.get<string>('KAFKA.ARTICLE_UPDATED_TOPIC'), [message]);
        logger.info(`Sent to kafka topic ${config.get<string>('KAFKA.ARTICLE_UPDATED_TOPIC')}`);
    } catch (err) {
        throw new Error(`Ошибка при отправке в топик Kafka ${config.get<string>('KAFKA.ARTICLE_UPDATED_TOPIC')}`)
    }
}