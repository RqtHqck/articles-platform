export const ArticleSchema = {
    type: "object",
    required: ["id", "title", "content", "publishedAt", "updatedAt"],
    properties: {
        id: {
            type: "integer",
            format: "int32",
            example: 123,
            description: "Уникальный идентификатор статьи",
        },
        title: {
            type: "string",
            maxLength: 255,
            example: "Заголовок статьи",
            description: "Уникальный заголовок статьи",
        },
        content: {
            type: "string",
            example: "Текст статьи...",
            description: "Основное содержание статьи",
        },
        publishedAt: {
            type: "string",
            format: "date-time",
            example: "2025-07-02T12:34:56Z",
            description: "Дата публикации (создания) статьи",
        },
        updatedAt: {
            type: "string",
            format: "date-time",
            example: "2025-07-03T15:20:00Z",
            description: "Дата последнего обновления статьи",
        },
        tags: {
            type: "array",
            description: "Массив связанных тегов",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        example: 7,
                    },
                    name: {
                        type: "string",
                        example: "tech",
                    },
                },
            },
        },
    },
}

export const ArticleCreateSchema = {
    type: "object",
    required: ["title", "content", "tags"],
    properties: {
        title: {
            type: "string",
            description: "Уникальный заголовок статьи",
            example: "Some new article"
        },
        content: {
            type: "string",
            description: "Содержимое статьи",
            example: "Текст статьи"
        },
        tags: {
            type: "array",
            description: "Массив ID тегов, которые должны существовать в системе",
            items: {
                type: "integer",
                example: 1
            },
            minItems: 1
        }
    }
}

export const ArticleGetAllSchema = {
    type: "object",
    required: ["page", "limit", "offset", "articles"],
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
        articles: {
            type: "array",
            description: "Массив статей",
            items: {
                $ref: "#/components/schemas/Article"
            }
        }
    }
}

export const ArticleUpdateSchema = {
    type: "object",
    required: ["title", "content", "tags"],
    properties: {
        title: {
            type: "string",
            description: "Новый уникальный заголовок статьи",
            example: "Some article updated"
        },
        content: {
            type: "string",
            description: "Обновлённое содержимое статьи",
            example: "Обновленный текст статьи"
        },
        tags: {
            type: "array",
            description: "Массив ID тегов, все должны существовать в системе",
            items: {
                type: "integer",
                example: 1
            },
            minItems: 1
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
