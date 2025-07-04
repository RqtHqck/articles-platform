#!/bin/bash

set -e  # если ошибка — выходим при любой ошибке

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Сборка и запуск docker-compose...${NC}"

SERVICE_FILE="docker-compose.service.yml"
DATABASE_FILE="docker-compose.database.yml"
APP_FILE="docker-compose.app.yml"

# Проверим, что файлы существуют
for file in "$SERVICE_FILE" "$DATABASE_FILE" "$APP_FILE"; do
  if [[ ! -f "$file" ]]; then
    echo -e "${RED}❌ Ошибка: файл '$file' не найден!${NC}"
    exit 1
  fi
done

# Собираем и запускаем в фоне
docker compose \
  -f "$SERVICE_FILE" \
  -f "$DATABASE_FILE" \
  -f "$APP_FILE" \
  up --build

#echo -e "${GREEN}Запуск завершён. Показываю логи...${NC}"

# Логи
#docker compose \
#  -f "$SERVICE_FILE" \
#  -f "$DATABASE_FILE" \
#  -f "$APP_FILE" \
#  logs -f --tail=100
