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

        await kafka.produce(process.env.KAFKA_ARTICLE_UPDATED_TOPIC!, [message]);
        logger.info(`Sent to kafka topic ${process.env.KAFKA_ARTICLE_UPDATED_TOPIC!}`);
    } catch (err) {
        throw new Error(`Ошибка при отправке в топик Kafka ${process.env.KAFKA_ARTICLE_UPDATED_TOPIC!}`)
    }
}