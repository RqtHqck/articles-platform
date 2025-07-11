import config from 'config';
import logger from '@libs/logger';
import kafka from '@libs/kafka/kafka';
import {IArticle} from "@entities/interfaces";

export default async function articleCreatedEvent(articleDto: IArticle): Promise<void> {
    try {
        const message = {
            key: `${articleDto.id!}`,
            value: {
                ...articleDto
            },
        };

        logger.info(`Send to kafka topic ${config.get<string>('KAFKA.ARTICLE_CREATED_TOPIC')}`);
        await kafka.produce(config.get<string>('KAFKA.ARTICLE_CREATED_TOPIC'), [message]);
    } catch (err) {
        logger.error('Failed to produce action log', err as Error);
    }
}