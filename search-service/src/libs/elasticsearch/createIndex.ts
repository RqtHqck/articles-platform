import esClient from "./elasticsearch";
import logger from "@libs/logger";
import {MappingTypeMapping} from "@elastic/elasticsearch/lib/api/types";

export async function createIndex(index: string, mappings: MappingTypeMapping): Promise<void> {
    const indexExists = await esClient.indices.exists({index});
    if(indexExists) {
        logger.info(`Index index ${JSON.stringify(index)} does already exist`)
        return;
    }

    // Создаём инекс
    await esClient.indices.create({
        index,
        mappings
    })
}

export async function deleteIndex(index: string): Promise<void> {
    const result = await esClient.indices.delete({
        index
    })
    logger.info('Index deleted:', result);
}