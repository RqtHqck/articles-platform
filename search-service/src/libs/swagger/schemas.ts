import {TagEnum} from "@entities/enums";

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

export const SearchArticlesSchema = {
    type: "object",
    properties: {
        page: { type: "integer", example: 1 },
        limit: { type: "integer", example: 10 },
        offset: { type: "integer", example: 0 },
        articles: {
            type: "array",
            items: { $ref: "#/components/schemas/Article" },
        },
    },
};

export const TagEnumSchema = {
    type: 'string',
    enum: Object.values(TagEnum),
}

export const TagEnumArraySchema = {
    type: 'array',
        items: {
        $ref: '#/components/schemas/TagEnum'
    }
}

