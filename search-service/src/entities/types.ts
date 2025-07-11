type TError = {
    code: string;
    text: string;
    data?: Record<string, any>;
}

type TErrorData = Record<string, any>;

export { TError, TErrorData };