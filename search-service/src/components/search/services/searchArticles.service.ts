import esClient from "@libs/elasticsearch/elasticsearch";
import logger from "@libs/logger";
import {ES_SortTypeEnum} from "@entities/enums";
import {IArticlesSearchResultES, ISearchQueryData} from "@entities/interfaces";
import {SearchHit, SearchResponseBody} from "@elastic/elasticsearch/lib/api/types";
import {SearchArticlesControllerResponse} from "@entities/types";


export default async function searchArticlesService(queryData: ISearchQueryData): Promise<SearchArticlesControllerResponse> {
    logger.info(`searchArticlesByQuery: queryData: ${JSON.stringify(queryData)}`);

    const {query, sort = ES_SortTypeEnum.RELEVANCE, page, limit, tags = []} = queryData;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 15;
    const offset = (pageNum - 1) * limitNum;

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

    const result: SearchResponseBody = await esClient.search({
        index: process.env.ELASTIC_ARTICLES_INDEX!,
        query: queryBody,
        from: offset,
        size: limitNum,
        sort: sort === ES_SortTypeEnum.RELEVANCE ? undefined : [{ [sort]: 'desc' }],
    });

    logger.info(`Articles search result:`, result);

    const response: IArticlesSearchResultES[] = result.hits.hits.map((hit: SearchHit): IArticlesSearchResultES => (
        hit._source as IArticlesSearchResultES
    ))

    return {
        page: pageNum,
        limit: limitNum,
        offset,
        articles: response
    };}