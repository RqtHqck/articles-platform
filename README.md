# Article Gateway Platform

1. Gateway
Проксирование к другим ms

2. Article Service
CRUD: создать, получить, удалить, обновить статьи
Хранит в PostgreSQL
Общение через Kafka
Высылает события (например, "новая статья создана") в лог и поиск

3. Search Service
ElasticSearch + Node.js-обёртка
Хранит индекс статей (или их заголовков, или слов)
Реализует поиск с фильтрами, сортировкой, лимитами

4. Log Service
Принимает события от других сервисов
Общение через Kafka
Хранит в PostgreSQL




## Основные сценарии
📌 1. Создание статьи
POST /articles
Gateway -> ArticleService

- сохраняет статью в PostgreSQL
- отправляет лог в LogService
- отправляет документ в SearchService
- SearchService индексирует статью в ElasticSearch

### Реаллизация
Валидация данных
DTO
### Тесты:
Юнит: сервис сохранения статьи
Интеграция: Kafka-триггеры, ES-индексация, лог-сервис


📌 2. Получение статьи
GET /articles/:id
Gateway → ArticleService

- читает в базе и возвращает

### Тесты
Юнит: getArticleById
E2E: через Gateway


📌 3. Поиск статей
GET /search?q=чистый&sort=date&limit=5
Gateway → SearchService

- Выполняется поиск в ElasticSearch
- Фильтрация по тексту, сортировка, лимит (q, sort, limit, offset)

### Тесты
Юнит: QueryBuilder для ES
Интеграция: ответы от Elastic по данным
E2E: по всем параметрам


📌 4. Обновление статьи
PUT /articles/:id
Gateway → ArticleService

- Статья обновляется в PostgreSQL
- Отправляется событие article.updated в Kafka
- SearchService обновляет индекс
- LogService пишет лог

### Реаллизация
Валидация данных
DTO
Обновление индекса в ES
Kafka: повторная отправка и замена в индексах

### Тесты
Юнит: updateArticle
Интеграция: Kafka → ES
E2E: проверка, что обновился индекс


📌 5. Удаление статьи
DELETE /articles/:id
Gateway → ArticleService

- Удаление из PostgreSQL
- Kafka → article.deleted
- SearchService удаляет из индекса
- LogService пишет лог

### Реаллизация
Удаление по id
Логирование событий удаления
ES удаление по documentId

### Тесты
Юнит: deleteArticle
Интеграция: удаление из ES
E2E: проверка 404 на повторный get


📌 6. Просмотр логов
GET /logs?service=articles&limit=10
Gateway → LogService

- Чтение логов из PostgreSQL
- Фильтрация логов по сервису
- Постраничная выборка / лимит

### Тесты
Юнит: getLogsByService
Интеграция: сохранение + запрос
E2E: запрос логов после событий


### Общие тесты: 
| Уровень    | Что покрывать                                 |
| ---------- | --------------------------------------------- |
| Юнит       | Сервисные функции, хелперы, билдеры           |
| Интеграция | Kafka, PostgreSQL, Elastic                    |
| E2E        | Потоковые сценарии от Gateway до ES и обратно |
| Mocks      | Kafka-консьюмеры, producer'ы                  |


## Финальный стек:
| Компонент      | Стек                         |
| -------------- | ---------------------------- |
| Gateway        | Node.js + Express/Fastify    |
| ArticleService | Node.js, TypeORM/Prisma + PG |
| LogService     | Node.js, Kafka, PostgreSQL   |
| SearchService  | Node.js + ElasticSearch SDK  |
| Kafka          | Confluent/Redpanda + kafkajs |
| ElasticSearch  | 8.x (docker)                 |
