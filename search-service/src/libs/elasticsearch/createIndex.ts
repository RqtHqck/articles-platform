import esClient from "./elasticsearch";
import logger from "@libs/logger";

export async function createIndex(index: string): Promise<void> {
    const indexExists = await esClient.indices.exists({index});
    if(indexExists) {
        logger.info('Index', index, 'does already exist')
        return;
    }

    await esClient.indices.create({
        index,
        body: {
            mappings: {
                properties: {
                    id: {type: 'keyword'},
                    title: {type: 'text'},
                    content: {type: 'text'}
                }
            },
            settings: {
                index: {
                    analysis: {
                        char_filter: {
                            text_char_filter: {
                                type: 'mapping',
                                mappings: [
                                    'Ё => ё',
                                    'ё => е',
                                    ', => .'
                                ]
                            }
                        },
                        analyzer: {
                            search_analyzer: {
                                type: 'custom',
                                tokenizer: 'standard',
                                filter: [
                                    'lowercase',
                                    'shingle',
                                    'russian_stop',
                                    'russian_stemmer'
                                ],
                                char_filter: 'text_char_filter'
                            }
                        },
                        filter: {
                            shingle: {
                                type: 'shingle',
                                min_shingle_size: 2,
                                max_shingle_size: 4,
                            },
                            russian_stop: {
                                type: 'stop'
                            },
                            russian_stemmer: {
                                type: 'stemmer',
                                language: 'russian'
                            }
                        }
                    }
                }
            }
        },
    })
}

export async function deleteIndex(index: string): Promise<void> {
    const result = await esClient.indices.delete({
        index
    })
    logger.info('Index deleted:', result);

}