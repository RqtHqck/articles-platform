import config from 'config';
import logger from '@libs/logger';
import kafka from '@libs/kafka/kafka';
import {IArticleCreatedEvent} from "@entities/interfaces";

export default async function articleCreatedEvent(articleDto: IArticleCreatedEvent): Promise<void> {
    try {
        const message = {
            key: `article_${articleDto.id!}`,
            value: {
                ...articleDto
            },
        };

        logger.info(`Send to kafka topic ${config.get<string>('KAFKA.ARTICLE_CREATED_TOPIC')}`);
        await kafka.produce(config.get<string>('KAFKA.ARTICLE_CREATED_TOPIC'), [message]);
    } catch (err) {
        throw new Error(`Ошибка при отправке в топик Kafka ${config.get<string>('KAFKA.ARTICLE_CREATED_TOPIC')}`)
    }
}