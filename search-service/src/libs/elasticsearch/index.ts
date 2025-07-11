import esClient from "./elasticsearch";
import {createIndex} from "./createIndex";
import logger from "@libs/logger";
import config from "config";

(async () => {
    await esClient
        .ping()
        .then(() => {
            logger.info("Elasticsearch is running")
        })
        .catch((err) => {
            logger.error('Elasticsearch unavailable', { error: err });
        })

    await createIndex(config.get<string>('ELASTICSEARCH.ARTICLES_INDEX'));
})()

export default esClient;
