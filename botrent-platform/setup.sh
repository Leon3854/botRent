#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   Добро пожаловать в установку BotRent!   ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Ошибка: Docker не установлен.${NC}"
    echo -e "${YELLOW}Установите Docker: https://docs.docker.com/engine/install/${NC}"
    exit 1
fi

# Проверка наличия Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}Ошибка: Docker Compose не установлен.${NC}"
    echo -e "${YELLOW}Установите Docker Compose: https://docs.docker.com/compose/install/${NC}"
    exit 1
fi

# Создание .env из .env.example, если файл не существует
if [ ! -f .env ]; then
    echo -e "${YELLOW}Создание .env файла...${NC}"
    cp .env.example .env
    echo -e "${GREEN}.env файл создан на основе .env.example.${NC}"
    echo -e "${YELLOW}Пожалуйста, заполните необходимые переменные окружения в .env файле.${NC}"
    read -p "Нажмите Enter после заполнения .env файла..."
else
    echo -e "${GREEN}.env файл уже существует.${NC}"
fi

# Сборка и запуск контейнеров
echo -e "${BLUE}Сборка и запуск Docker-контейнеров...${NC}"
docker compose up -d --build

# Применение миграций Prisma
echo -e "${BLUE}Применение миграций базы данных...${NC}"
docker exec -it botrent-backend npx prisma migrate deploy

# Сидирование начальных данных
echo -e "${BLUE}Добавление начальных данных (тарифы)...${NC}"
docker exec -it botrent-backend npx ts-node scripts/seed.ts

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   Платформа BotRent успешно запущена!   ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Сайт доступен по адресу: http://localhost${NC}"
echo -e "${GREEN}API доступен по адресу: http://localhost/api${NC}"
echo -e "${GREEN}Для остановки используйте: docker compose down${NC}"