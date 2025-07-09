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