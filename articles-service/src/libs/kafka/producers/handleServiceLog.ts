import config from 'config';
import logger from '@libs/logger';
import kafka from '@libs/kafka/kafka';
import {TLogCreateDto} from "@entities/types";

export default async function handleServiceLog(logData: TLogCreateDto): Promise<void> {
    try {
        const message = {
            key: `log`,
            value: {
                message: logData.message,
                source: logData.source,
            },
        };

        logger.info(`Send to kafka topic ${config.get<string>('KAFKA.ACTION_TOPIC')}`);
        await kafka.produce(config.get<string>('KAFKA.ACTION_TOPIC'), [message]);
    } catch (err) {
        logger.error('Failed to produce action log', err as Error);
    }
}