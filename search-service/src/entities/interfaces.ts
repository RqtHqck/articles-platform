import {ES_SortTypeEnum, TagEnum} from "@entities/enums";

export interface IArticle {
    id?: number;
    title: string;
    content: string;
    publishedAt: Date;
    updatedAt: Date;
}

export interface ITag {
    id?: string;
    label: TagEnum;
}

export interface IArticleEventDto {
    id: number;
    title: string;
    content: string;
    tags: ITag[];
    publishedAt: Date;
    updatedAt: Date;
}

export interface IArticleCreatedEvent extends IArticleEventDto {}
export interface IArticleUpdatedEvent extends IArticleEventDto {}
export interface IArticlesSearchResultES extends IArticleEventDto {}


export interface ISearchQueryData {
    query: string;
    tags?: TagEnum[];
    page?: number | string;
    limit?: number | string;
    sort?: ES_SortTypeEnum;
}

