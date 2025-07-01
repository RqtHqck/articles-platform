import {TagEnum} from "@entities/enums";

export interface ICreateArticleDto {
    title: string;
    content: string;
    tags: number[];
}


export interface IArticle {
    title: string;
    content: string;
}

export interface ITag {
    id?: string;
    label: TagEnum;
}