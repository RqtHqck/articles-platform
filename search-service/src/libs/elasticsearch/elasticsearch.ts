import {Client} from "@elastic/elasticsearch"
import config from "config";
import logger from "@libs/logger";

const esClient = new Client({
    node: config.get<string>('ELASTICSEARCH.URL'),
    auth: {
        username: config.get<string>('ELASTICSEARCH.USERNAME'),
        password: config.get<string>('ELASTICSEARCH.PASSWORD')
    }
});

esClient
    .ping()
    .then(() => {
        logger.info("Elasticsearch is running")
    })
    .catch((err) => {
        logger.error('Elasticsearch unavailable', { error: err });
    })

export default esClient;