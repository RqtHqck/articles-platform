import config from "config";
import kafka from "@libs/kafka/kafka"
import logger from "@libs/logger";
import {addToArticleIndex} from "@components/search/services";
import {retry} from "@helpers/retry";


export default async function consumeArticleCreatedEvent(): Promise<void> {
    try {
        logger.info("consumeArticleCreatedEvent...")
        await retry(async () => {
            await kafka.consume(config.get<string>("KAFKA.ARTICLE_CREATED_TOPIC"), addToArticleIndex);
        }, 10, 2500)
    } catch (err) {
        throw new Error(`Ошибка при обработке в топике Kafka ${config.get<string>("KAFKA.ARTICLE_CREATED_TOPIC")}`)
    }
};
