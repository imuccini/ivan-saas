import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: {
      email: 'muccini.ivan@gmail.com',
    },
  });

  if (user) {
    console.log('User found:', user);
    // Delete the user to allow fresh sign-up
    await prisma.user.delete({
        where: {
            email: 'muccini.ivan@gmail.com',
        }
    });
    console.log('User deleted.');
  } else {
    console.log('User not found.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
