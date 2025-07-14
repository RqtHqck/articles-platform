import config from 'config';
import logger from '@libs/logger';
import kafka from '@libs/kafka/kafka';

export default async function articleDeletedHandler(articleId: number): Promise<void> {
    try {
        const message = {
            key: null,
            value: {
                articleId
            },
        };

        await kafka.produce(config.get<string>('KAFKA.ARTICLE_DELETED_TOPIC'), [message]);
        logger.info(`Sent to kafka topic ${config.get<string>('KAFKA.ARTICLE_DELETED_TOPIC')}`);
    } catch (err) {
        throw new Error(`Ошибка при отправке в топик Kafka ${config.get<string>('KAFKA.ARTICLE_DELETED_TOPIC')}`)
    }
}