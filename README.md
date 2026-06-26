# BotRent Platform

Платформа для аренды Telegram-ботов.

## Быстрый старт

1.  Склонируйте репозиторий.
2.  Запустите скрипт установки: `chmod +x setup.sh && ./setup.sh`
3.  Откройте `http://localhost` в браузере.

BotRent — Платформа аренды Telegram-ботов

<div align="center">

![BotRent Logo](https://img.shields.io/badge/BotRent-v1.0.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10-red?style=for-the-badge&logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-6.6.0-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

**Полнофункциональная платформа для создания, управления и монетизации Telegram-ботов**

[📖 Документация](#-документация) • [🚀 Быстрый старт](#-быстрый-старт) • [🏗 Архитектура](#-архитектура) • [📊 API](#-api) • [🔒 Безопасность](#-безопасность)

</div>

---

## 📑 Содержание

- [Обзор проекта](#-обзор-проекта)
- [Возможности](#-возможности)
- [Технологический стек](#-технологический-стек)
- [Архитектура](#-архитектура)
- [Структура проекта](#-структура-проекта)
- [Быстрый старт](#-быстрый-старт)
- [Переменные окружения](#-переменные-окружения)
- [API документация](#-api-документация)
- [База данных](#-база-данных)
- [Безопасность](#-безопасность)
- [Деплой](#-деплой)
- [Разработка](#-разработка)
- [Лицензия](#-лицензия)

---

## 🌟 Обзор проекта

**BotRent** — это SaaS-платформа для аренды и управления Telegram-ботами. Позволяет предпринимателям быстро создавать и настраивать ботов для автоматизации бизнес-процессов: записи клиентов, продаж, поддержки и уведомлений.

### 🎯 Ключевые особенности

- ✨ Современный адаптивный лендинг с анимациями
- 🔐 JWT-аутентификация с access/refresh токенами
- 💳 Приём платежей через ЮKassa
- 🤖 Управление ботами (создание, настройка, запуск/остановка)
- 📊 Личный кабинет со статистикой
- 📱 Telegram-уведомления для администраторов
- 🐳 Полная Docker-контейнеризация
- 🚀 Одноразовый деплой через скрипты

---

## 🚀 Возможности

### Для клиентов
- ✅ Просмотр тарифов и выбор оптимального плана
- ✅ Регистрация и авторизация
- ✅ Создание ботов разных типов (запись, каталог, квиз, уведомления)
- ✅ Управление ботами (настройка, запуск/остановка)
- ✅ Просмотр активной подписки и истории платежей
- ✅ Оплата тарифов через ЮKassa

### Для администраторов
- ✅ Получение уведомлений о новых платежах в Telegram
- ✅ Управление пользователями
- ✅ Просмотр лидов с лендинга

---

## 🛠 Технологический стек

### Frontend
| Технология | Версия | Назначение |
|-----------|--------|------------|
| Next.js | 14.1.0 | React-фреймворк с SSR/SSG |
| TypeScript | 5.3.3 | Типизация |
| TailwindCSS | 3.4.1 | Утилитарный CSS-фреймворк |
| shadcn/ui | latest | Компонентная библиотека |
| Framer Motion | 11.0.3 | Анимации |
| React Hook Form | 7.49.3 | Управление формами |
| Zod | 3.22.4 | Валидация данных |
| Lucide React | 0.323.0 | Иконки |

### Backend
| Технология | Версия | Назначение |
|-----------|--------|------------|
| NestJS | 10.3.1 | Фреймворк для серверных приложений |
| Prisma | 6.6.0 | ORM для работы с БД |
| Passport.js | 0.7.0 | JWT-аутентификация |
| bcrypt | 5.1.1 | Хеширование паролей |
| class-validator | 0.14.0 | Валидация DTO |

### Инфраструктура
| Технология | Версия | Назначение |
|-----------|--------|------------|
| PostgreSQL | 16 | Основная база данных |
| Redis | 7 | Кеширование и сессии |
| Docker | latest | Контейнеризация |
| Nginx | alpine | Reverse proxy |
| Node.js | 20 LTS | Среда выполнения |

---

## 🏗 Архитектура

### Системная архитектура

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js 14<br/>Port 3000]
        A1[App Router]
        A2[Server Components]
        A3[Client Components]
        A --> A1
        A1 --> A2
        A1 --> A3
    end

    subgraph "Reverse Proxy"
        B[Nginx<br/>Port 80/443]
    end

    subgraph "Backend Layer"
        C[NestJS<br/>Port 4000]
        C1[Auth Module]
        C2[Bots Module]
        C3[Payments Module]
        C4[Subscriptions Module]
        C --> C1
        C --> C2
        C --> C3
        C --> C4
    end

    subgraph "Data Layer"
        D[(PostgreSQL 16<br/>Port 5432)]
        E[(Redis 7<br/>Port 6379)]
    end

    subgraph "External Services"
        F[YooKassa API]
        G[Telegram Bot API]
    end

    A <--> B
    B <--> C
    C <--> D
    C <--> E
    C3 <--> F
		C2 <--> G

## Docker-архитектура

```markdown
graph LR
    subgraph "Docker Environment"
        subgraph "Network: botrent-network"
            N[Nginx<br/>:80 :443]
            F[Frontend<br/>:3000]
            B[Backend<br/>:4000]
            P[(PostgreSQL<br/>:5432)]
            R[(Redis<br/>:6379)]
        end
    end

    Client([Client Browser]) --> N
    N --> F
    N --> B
    B --> P
    B --> R
    F --> B

```
