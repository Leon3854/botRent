import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем сидирование базы данных...');

  // Тарифы
  const plans = [
    {
      name: 'Старт',
      price: 1990,
      maxBots: 1,
      features: JSON.stringify([
        '1 бот',
        'Базовая поддержка',
        '3 дня теста',
      ]),
    },
    {
      name: 'Бизнес',
      price: 3990,
      maxBots: 2,
      features: JSON.stringify([
        '2 бота',
        'Приоритетная поддержка',
        'Статистика',
        '3 дня теста',
      ]),
    },
    {
      name: 'Премиум',
      price: 7990,
      maxBots: 5,
      features: JSON.stringify([
        'До 5 ботов',
        'Личный менеджер',
        'Интеграции',
        '3 дня теста',
      ]),
    },
  ];

  for (const plan of plans) {
    const existingPlan = await prisma.plan.findFirst({
      where: { name: plan.name },
    });

    if (!existingPlan) {
      await prisma.plan.create({ data: plan });
      console.log(`✅ Тариф "${plan.name}" создан`);
    } else {
      console.log(`ℹ️ Тариф "${plan.name}" уже существует`);
    }
  }

  console.log('✅ Сидирование завершено');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка сидирования:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });