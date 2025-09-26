import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if SuperAdmin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { email: 'admin@gmail.com' },
  });

  if (existingAdmin) {
    console.log('SuperAdmin already exists.');
    return;
  }

  await prisma.user.create({
    data: {
      firstName: 'System',
      lastName: 'Admin',
      username: 'superadmin',
      email: 'admin@gmail.com',
      password: '$2a$10$BOVBS/AYgCh0n.zFMdLY1.QjYfLFqkm94pJPMh49wNtTSgbDlylzu', // hash of Admin@123
      role: UserRole.SuperAdmin,
      emailVerified: true,
      phoneNumberVerified: true,
      accountStatus: 'active',
      identityVerified: true,
    },
  });

  console.log('✅ SuperAdmin seeded');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
