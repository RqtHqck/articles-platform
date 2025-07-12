export const LogSchema = {
    type: "object",
    required: ["id", "source", "message", "createdAt"],
    properties: {
        id: {
            type: "integer",
            format: "int32",
            example: 123,
            description: "Уникальный идентификатор записи лога",
        },
        source: {
            type: "string",
            maxLength: 100,
            example: "api-gateway",
            description: "Источник лога (сервис или модуль)",
        },
        message: {
            type: "string",
            example: "Ошибка подключения к базе данных",
            description: "Текст сообщения лога",
        },
        createdAt: {
            type: "string",
            format: "date-time",
            example: "2025-07-12T14:00:00Z",
            description: "Дата и время создания записи",
        },
    },
};

export const LogGetAllSchema = {
    type: "object",
    required: ["page", "limit", "offset", "logs"],
    properties: {
        page: {
            type: "number",
            description: "Номер страницы",
            example: 1
        },
        limit: {
            type: "number",
            description: "Количество документов на странице",
            example: 3
        },
        offset: {
            type: "number",
            description: "Смещение по страницам",
            example: 0
        },
        logs: {
            type: "array",
            description: "Массив логов",
            items: {
                $ref: "#/components/schemas/Log"
            }
        }
    }
}



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
