import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const clients = [];

  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.exampleEmail({
      firstName: firstName,
      lastName: lastName,
    });
    const phoneNumber = faker.phone.number();
    const address = `${faker.location.street()},${faker.location.city()},${faker.location.country()}`;
    const client = prisma.client.upsert({
      where: { email },
      update: {},
      create: {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
      },
    });

    clients.push(client);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
