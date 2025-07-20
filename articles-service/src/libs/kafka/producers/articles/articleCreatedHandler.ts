import logger from '@libs/logger';
import kafka from '@libs/kafka/kafka';
import {IArticleCreatedEvent} from "@entities/interfaces";

export default async function articleCreatedHandler(articleDto: IArticleCreatedEvent): Promise<void> {
    try {
        const message = {
            key: null,
            value: {
                ...articleDto
            },
        };

        await kafka.produce(process.env.KAFKA_ARTICLE_CREATED_TOPIC!, [message]);
        logger.info(`Sent to kafka topic ${process.env.KAFKA_ARTICLE_CREATED_TOPIC!}`);
    } catch (err) {
        throw new Error(`Ошибка при отправке в топик Kafka ${process.env.KAFKA_ARTICLE_CREATED_TOPIC!}`)
    }
}