import {TagEnum} from "@entities/enums";

export interface ICreateArticleDto {
    title: string;
    content: string;
    tags: number[];
}

export interface IUpdateArticleDto {
    title: string;
    content: string;
    tags: number[];
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

export interface ILog {
    id?: string;
    source: string;
    message: string;
    createdAt: Date;
}

export interface ILabel {
    method: string;
    route: string;
    status: string;
    status_сode: string;
}
