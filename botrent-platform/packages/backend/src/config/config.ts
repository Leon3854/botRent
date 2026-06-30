export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  database: {
    url: process.env.DATABASE_URL || '',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },
  yookassa: {
    shopId: process.env.YUKASSA_SHOP_ID || '',
    secretKey: process.env.YUKASSA_SECRET_KEY || '',
    apiUrl: 'https://api.yookassa.ru/v3',
  },
  telegram: {
    botToken: process.env.BOT_TOKEN || '',
    adminId: process.env.ADMIN_TELEGRAM_ID || '',
  },
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
});
