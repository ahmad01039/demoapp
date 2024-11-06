import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password123', 10);

  await prisma.users.createMany({
    data: [
      { name: 'John Doe', email: 'john1@example.com', password: hashedPassword1 },
      { name: 'Jane Smith', email: 'jane1@example.com', password: hashedPassword2 },
    ],
  });

  await prisma.product.createMany({
    data: [
      { name: 'Men’s Jacket', price: 99.99, category: 'men' },
      { name: 'Women’s Scarf', price: 29.99, category: 'women' },
      { name: 'Kids’ T-shirt', price: 19.99, category: 'kids' },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
