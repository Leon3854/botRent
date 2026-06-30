#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   Добро пожаловать в установку BotRent!   ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Ошибка: Docker не установлен.${NC}"
    exit 1
fi

# Проверка наличия Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}Ошибка: Docker Compose не установлен.${NC}"
    exit 1
fi

# Создание .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}Создание .env файла...${NC}"
    cat > .env << 'EOF'
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=botrent_db
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/botrent_db?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=test-jwt-secret-change-in-production
JWT_REFRESH_SECRET=test-jwt-refresh-secret-change-in-production
YUKASSA_SHOP_ID=test_shop_id
YUKASSA_SECRET_KEY=test_secret_key
BOT_TOKEN=test_bot_token
ADMIN_TELEGRAM_ID=test_admin_id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
    echo -e "${GREEN}.env файл создан!${NC}"
fi

# Запускаем только базы данных в Docker
echo -e "${BLUE}1/4 Запуск PostgreSQL и Redis в Docker...${NC}"
docker compose up -d postgres redis

echo -e "${YELLOW}Ожидание готовности баз данных...${NC}"
sleep 15

# Проверка готовности БД
until docker exec botrent-db pg_isready -U postgres -d botrent_db 2>/dev/null; do
    echo -e "${YELLOW}Ожидание PostgreSQL...${NC}"
    sleep 3
done

# Создаём базу если не существует
docker exec botrent-db psql -U postgres -c "CREATE DATABASE botrent_db;" 2>/dev/null
echo -e "${GREEN}✅ Базы данных готовы!${NC}"

# Установка зависимостей и миграции бэкенда
echo -e "${BLUE}2/4 Настройка бэкенда...${NC}"
cd packages/backend
npm install
npx prisma generate
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/botrent_db?schema=public" \
npx prisma db push
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/botrent_db?schema=public" \
npx ts-node scripts/seed.ts
echo -e "${GREEN}✅ Бэкенд настроен!${NC}"

# Запуск бэкенда в фоне
echo -e "${BLUE}3/4 Запуск бэкенда...${NC}"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/botrent_db?schema=public" \
REDIS_URL="redis://localhost:6379" \
JWT_SECRET="test-jwt-secret-change-in-production" \
JWT_REFRESH_SECRET="test-jwt-refresh-secret-change-in-production" \
npm run start:dev &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/botrent-backend.pid
cd ../..

# Установка и запуск фронтенда
echo -e "${BLUE}4/4 Запуск фронтенда...${NC}"
cd packages/frontend
npm install
npm run dev &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/botrent-frontend.pid
cd ../..

sleep 5

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   Платформа BotRent успешно запущена!   ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}🌐 Сайт: http://localhost:3000${NC}"
echo -e "${GREEN}🔌 API:  http://localhost:4000/api${NC}"
echo ""
echo -e "${YELLOW}Для остановки:${NC}"
echo -e "  kill \$(cat /tmp/botrent-backend.pid)"
echo -e "  kill \$(cat /tmp/botrent-frontend.pid)"
echo -e "  docker compose down"
echo -e "${GREEN}=========================================${NC}"
