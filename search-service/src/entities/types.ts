import {IArticle} from "@entities/interfaces";

type TError = {
    code: string;
    text: string;
    data?: Record<string, any>;
}

type TErrorData = Record<string, any>;

type SearchArticlesControllerResponse = {
    page: number;
    limit: number;
    offset: number;
    articles: IArticle[]
}

export { TError, TErrorData, SearchArticlesControllerResponse };