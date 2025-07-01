import {ITag} from "@entities/interfaces";

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

export { TError, TErrorData };