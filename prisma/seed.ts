import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  const xboxCategory = await prisma.category.create({
    data: { name: "Xbox", slug: "xbox" },
  });

  const categories = await prisma.category.createMany({
    data: [
      { name: "PlayStation", slug: "playstation" },
      { name: "Nintendo", slug: "nintendo" },
      { name: "Геймпады", slug: "gamepads" },
      { name: "Аксессуары", slug: "accessories" },
      { name: "Игры", slug: "games" },
    ],
  });

  const products = [
    {
      name: "Microsoft Xbox Series S Robot White 512GB SSD",
      slug: "xbox-series-s-white-512gb",
      description: "Игровая приставка Microsoft Xbox Series S Robot White 512 Гб SSD. Самая компактная консоль нового поколения.",
      price: 3998900,
      priceOld: 4499000,
      images: ["https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1000"],
      brand: "Microsoft",
      color: "White",
      attributes: { "Память": "512Гб", "Цвет": "Белый" },
      categoryId: xboxCategory.id,
      isNew: true,
      stock: 15,
    },
    {
      name: "Microsoft Xbox Series S Carbon Black 1TB SSD",
      slug: "xbox-series-s-black-1tb",
      description: "Игровая приставка Microsoft Xbox Series S Carbon Black 1 Тб SSD. Полностью цифровая консоль в стильном черном цвете.",
      price: 4504500,
      priceOld: 4999000,
      images: ["https://images.unsplash.com/photo-1621259182978-f09e5e2ca09a?q=80&w=1000"],
      brand: "Microsoft",
      color: "Black",
      attributes: { "Память": "1Тб", "Цвет": "Черный" },
      categoryId: xboxCategory.id,
      isSale: true,
      stock: 8,
    },
    {
      name: "Microsoft Xbox Series S Robot White 1TB SSD",
      slug: "xbox-series-s-white-1tb",
      description: "Игровая приставка Microsoft Xbox Series S Robot White 1 Тб SSD. Теперь с увеличенным объемом памяти для ваших игр.",
      price: 4680000,
      images: ["https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1000"],
      brand: "Microsoft",
      color: "White",
      attributes: { "Память": "1Тб", "Цвет": "Белый" },
      categoryId: xboxCategory.id,
      stock: 12,
    },
    {
      name: "Microsoft Xbox Series S + Game Pass на 3 месяца",
      slug: "xbox-series-s-game-pass-bundle",
      description: "Комплект Xbox Series S с подпиской Game Pass Ultimate на 3 месяца. Начните играть сразу!",
      price: 3378700,
      priceOld: 3850000,
      images: ["https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1000"],
      brand: "Microsoft",
      color: "White",
      attributes: { "Подписка": "3 месяца", "Память": "512Гб" },
      categoryId: xboxCategory.id,
      stock: 20,
    },
    {
      name: "Xbox Series S + 2-й геймпад Carbon Black + Зарядная станция",
      slug: "xbox-series-s-bundle-black",
      description: "Полный игровой комплект: консоль Xbox Series S, дополнительный черный геймпад и зарядная станция iPega.",
      price: 4714800,
      images: ["/xbox_series_s_bundles_1776268493407.png"],
      brand: "Microsoft",
      color: "White/Black",
      attributes: { "Геймпады": "2 шт", "Аксессуары": "Зарядная станция" },
      categoryId: xboxCategory.id,
      stock: 5,
    },
    {
      name: "Xbox Series S + 2-й геймпад Pulse Red + Зарядная станция",
      slug: "xbox-series-s-bundle-red",
      description: "Яркий комплект: консоль Xbox Series S, дополнительный красный геймпад Pulse Red и зарядная станция.",
      price: 4698900,
      images: ["/xbox_series_s_bundles_1776268493407.png"],
      brand: "Microsoft",
      color: "White/Red",
      attributes: { "Геймпады": "2 шт", "Цвет геймпада": "Pulse Red" },
      categoryId: xboxCategory.id,
      stock: 3,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("Seed completed with parsed data!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
