import {ITag} from "@entities/interfaces";

type TError = {
    code: string;
    text: string;
    data?: Record<string, any>;
}

type TErrorData = Record<string, any>;

export type TTagCreation = Pick<ITag, 'label'>;

export { TError, TErrorData };