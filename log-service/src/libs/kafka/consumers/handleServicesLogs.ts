import config from "config";
import kafka from "@libs/kafka/kafka"
import {CreateLogService} from "@components/logs/services";
import logger from "@libs/logger";
import {retry} from "@helpers/retry";


export default async function consumeServicesLogs() {
    try {
        logger.info("ConsumeServicesLogs...")
        await retry(async () => {
            await kafka.consume(config.get("KAFKA.ACTION_TOPIC"), CreateLogService);
        }, 10, 2500)
    } catch (err) {
        logger.info('Consumer failed', err);
    }
};
