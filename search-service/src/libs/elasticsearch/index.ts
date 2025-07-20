import esClient from "./elasticsearch";
import {createIndex} from "./createIndex";
import logger from "@libs/logger";
import {MappingTypeMapping} from "@elastic/elasticsearch/lib/api/types";

(async () => {
    await esClient
        .ping()
        .then(() => {
            logger.info("Elasticsearch is running")
        })
        .catch((err) => {
            logger.error('Elasticsearch unavailable', { error: err });
        })

    await createIndex(
        process.env.ELASTIC_ARTICLES_INDEX!,
        {
            properties: {
                id: {type: 'integer'},
                title: {type: 'text'},
                content: {type: 'text'},
                tags: {
                    type: "nested",
                    properties: {
                        id: {
                            type: "integer"
                        },
                        label: {
                            type: "keyword",
                        }
                    }
                },
                publishedAt: {type: "date"},
                updatedAt: {type: "date"}
            }
        } as MappingTypeMapping);
})()

export default esClient;
