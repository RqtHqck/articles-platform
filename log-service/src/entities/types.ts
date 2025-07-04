import {ILog} from "@entities/interfaces";

type TError = {
    code: string;
    text: string;
    data?: Record<string, any>;
}

type TErrorData = Record<string, any>;
export { TError, TErrorData };

export type TLogCreateDto = Pick<ILog, 'message' | 'source'>;
