import logger from '@libs/logger';
import kafka from '@libs/kafka/kafka';

export default async function articleDeletedHandler(id: number): Promise<void> {
    try {
        const message = {
            key: null,
            value: {
                id
            },
        };

        await kafka.produce(process.env.KAFKA_ARTICLE_DELETED_TOPIC!, [message]);
        logger.info(`Sent to kafka topic ${process.env.KAFKA_ARTICLE_DELETED_TOPIC!}`);
    } catch (err) {
        throw new Error(`Ошибка при отправке в топик Kafka ${process.env.KAFKA_ARTICLE_DELETED_TOPIC!}`)
    }
}