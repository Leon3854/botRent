#!/bin/bash

# Скрипт для деплоя на VPS
set -e

echo "🚀 Начинаем деплой BotRent..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Устанавливаем..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker установлен. Перезайдите в систему для применения изменений."
    exit 0
fi

# Переходим в директорию проекта
cd "$(dirname "$0")/.."

# Копируем .env.example если .env не существует
if [ ! -f .env ]; then
    echo "📝 Создаём .env файл..."
    cp .env.example .env
    echo "⚠️ Пожалуйста, отредактируйте .env файл с вашими реальными данными!"
    exit 1
fi

# Загружаем последние изменения
echo "📥 Загружаем обновления..."
git pull origin main

# Собираем и запускаем контейнеры
echo "🏗️ Собираем Docker образы..."
docker compose -f docker-compose.yml build

echo "🚀 Запускаем контейнеры..."
docker compose -f docker-compose.yml up -d

# Применяем миграции
echo "🔄 Применяем миграции базы данных..."
docker exec botrent-backend npx prisma migrate deploy

# Запускаем сидирование
echo "🌱 Заполняем базу данных начальными данными..."
docker exec botrent-backend npx ts-node scripts/seed.ts

# Проверяем статус
echo "✅ Проверяем статус контейнеров..."
docker compose -f docker-compose.yml ps

echo "🎉 Деплой завершён!"
echo "📊 Сайт доступен по адресу: https://botrent.ru"
echo "📊 Для просмотра логов: docker compose -f docker-compose.yml logs -f"