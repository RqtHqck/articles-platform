type TError = {
    code: string;
    text: string;
    data?: Record<string, any>;
}

type TErrorData = Record<string, any>;

export type TLabel = Partial<Record<string, string | number>>

export { TError, TErrorData };