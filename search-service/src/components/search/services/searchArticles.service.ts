import esClient from "@libs/elasticsearch/elasticsearch";
import logger from "@libs/logger";
import config from "config";
import {ES_SortTypeEnum} from "@entities/enums";
import {ISearchQueryData} from "@entities/interfaces";
import {SearchResponse} from "@elastic/elasticsearch/lib/api/types";




export default async function searchArticlesService(queryData: ISearchQueryData): Promise<SearchResponse> {
    logger.info(`searchArticlesByQuery: queryData: ${JSON.stringify(queryData)}`);

    const {query, sort = ES_SortTypeEnum.RELEVANCE, page, limit, tags = []} = queryData;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 15;

    const queryBody = {
        bool: {
            must: [
                {
                    multi_match: {
                        query,
                        fields: ['title^2', 'content'],
                        fuzziness: 'AUTO',
                        max_expansions: 50,
                    },
                },
            ],
            filter:
                tags.length
                ?
                [
                    {
                        nested: {
                            path: 'tags',
                            query: {
                                terms: {
                                    'tags.label': tags
                                }
                            }
                        }
                    }
                ]
                :
                []
        },
    };

    const result = esClient.search({
        index: config.get<string>('ELASTICSEARCH.ARTICLES_INDEX'),
        query: queryBody,
        from: (pageNum - 1) * limitNum,
        size: limitNum,
        sort: sort === ES_SortTypeEnum.RELEVANCE ? undefined : [{ [sort]: 'desc' }],
    });

    logger.info(`Articles search result:`, result);

    return result;
}