import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // Create Categories
  const xboxCategory = await prisma.category.create({
    data: {
      name: "Xbox",
      slug: "xbox",
    },
  });

  const psCategory = await prisma.category.create({
    data: {
      name: "PlayStation",
      slug: "playstation",
    },
  });

  const nintendoCategory = await prisma.category.create({
    data: {
      name: "Nintendo",
      slug: "nintendo",
    },
  });

  await prisma.category.createMany({
    data: [
      { name: "Геймпады", slug: "gamepads" },
      { name: "Аксессуары", slug: "accessories" },
      { name: "Игры", slug: "games" },
    ],
  });

  // Create Products for Xbox
  const products = [
    {
      name: "Xbox Series X",
      slug: "xbox-series-x",
      description: "Самая мощная консоль Xbox в истории.",
      price: 55000,
      priceOld: 60000,
      images: ["https://images.unsplash.com/photo-1621259182978-f09e5e2ca09a?q=80&w=1000"],
      inStock: true,
      isNew: true,
      brand: "Microsoft",
      color: "Black",
      attributes: { "SSD": "1TB", "Resolution": "4K" },
      categoryId: xboxCategory.id,
    },
    {
      name: "Xbox Series S",
      slug: "xbox-series-s",
      description: "Компактная и мощная игровая консоль.",
      price: 30000,
      priceOld: 35000,
      images: ["https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1000"],
      inStock: true,
      isNew: false,
      brand: "Microsoft",
      color: "White",
      attributes: { "SSD": "512GB", "Resolution": "1440p" },
      categoryId: xboxCategory.id,
    },
    {
      name: "Геймпад Xbox Deep Pink",
      slug: "xbox-controller-pink",
      description: "Беспроводной геймпад Xbox.",
      price: 6500,
      images: ["https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=1000"],
      brand: "Microsoft",
      color: "Deep Pink",
      categoryId: xboxCategory.id,
    },
    {
      name: "Xbox Game Pass Ultimate",
      slug: "xbox-game-pass-ultimate",
      description: "Подписка на 12 месяцев.",
      price: 12000,
      images: ["https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1000"],
      brand: "Microsoft",
      categoryId: xboxCategory.id,
    },
    {
      name: "Зарядная станция для геймпадов",
      slug: "xbox-charging-station",
      description: "Зарядная станция на два геймпада.",
      price: 2500,
      images: ["https://images.unsplash.com/photo-1621259182978-f09e5e2ca09a?q=80&w=1000"],
      brand: "Microsoft",
      categoryId: xboxCategory.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
