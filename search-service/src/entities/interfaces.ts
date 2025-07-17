import {TagEnum} from "@entities/enums";

export interface IArticle {
    id?: number;
    title: string;
    content: string;
    publishedAt: Date;
    updatedAt: Date;
}

export interface IArticleCreatedEvent {
    id: number;
    title: string;
    content: string;
    tags: TagEnum[];
    publishedAt: Date;
    updatedAt: Date;
}

export interface IArticleUpdatedEvent {
    id: number;
    title: string;
    content: string;
    tags: TagEnum[];
    publishedAt: Date;
    updatedAt: Date;
}