import config from "config";
import kafka from "@libs/kafka/kafka"
import {CreateLogService} from "@components/logs/services";
import logger from "@libs/logger";


export default async function consumeServicesLogs() {
    try {
        logger.info("ConsumeServicesLogs...")
        await kafka.consume(config.get("KAFKA.ACTION_TOPIC"), CreateLogService);
    } catch (err) {
        logger.info('Consumer failed', err);
    }
};
