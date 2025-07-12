export const ErrorSchema = {
    type: "object",
        properties: {
        code: { type: "string", example: "bad_request_error" },
        text: { type: "string", example: "Некорректные tag id" },
        data: { type: "object", description: "Дополнительные данные об ошибке", nullable: true }
    }
}

export const SuccessSchema = {
    type: "object",
    properties: {
        status: { type: "string", example: "OK" },
    }
}
