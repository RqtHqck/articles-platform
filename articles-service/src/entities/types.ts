import {IArticle, ILog, ITag} from "@entities/interfaces";

type TError = {
    code: string;
    text: string;
    data?: Record<string, any>;
}

type TErrorData = Record<string, any>;

export type TTagCreation = Pick<ITag, 'label'>;

export type TArticleTagsCreation = {
    tagId: number,
    articleId: number,
}
export type TLogCreateDto = Pick<ILog, 'message' | 'source'>;

export type GetAllArticlesControllerResponse = {
    page: number;
    limit: number;
    offset: number;
    articles: IArticle[]
}

export type TLabel = Partial<Record<string, string | number>>

export { TError, TErrorData };