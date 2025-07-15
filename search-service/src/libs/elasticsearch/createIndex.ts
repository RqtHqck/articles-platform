import esClient from "./elasticsearch";
import logger from "@libs/logger";

export async function createIndex(index: string): Promise<void> {
    const indexExists = await esClient.indices.exists({index});
    if(indexExists) {
        logger.info('Index', index, 'does already exist')
        return;
    }

    // Создаём инекс
    await esClient.indices.create({
        index,
        mappings: {
            properties: {
                id: {type: 'keyword'},
                title: {type: 'text'},
                content: {type: 'text'},
                tags: {type: "keyword"},
            }
        }
    })
}

export async function deleteIndex(index: string): Promise<void> {
    const result = await esClient.indices.delete({
        index
    })
    logger.info('Index deleted:', result);
}