#!/bin/bash

echo "Остановка и удаление контейнеров..."
docker compose down -v

echo "Удаление node_modules..."
rm -rf packages/frontend/node_modules
rm -rf packages/backend/node_modules

echo "Удаление .env..."
rm -f .env

echo "Очистка завершена."