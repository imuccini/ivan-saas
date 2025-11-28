import { db } from './prisma/client';

async function main() {
  const user = await db.user.findUnique({
    where: {
      email: 'muccini.ivan@gmail.com',
    },
  });

  if (user) {
    console.log('User found:', user);
    // Delete the user to allow fresh sign-up
    await db.user.delete({
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
    await db.$disconnect();
  });
