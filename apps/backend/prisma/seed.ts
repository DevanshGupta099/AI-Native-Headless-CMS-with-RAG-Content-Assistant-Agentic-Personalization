import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding initial ContentPilot users...');

  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin123!', salt);
  const editorPassword = await bcrypt.hash('Editor123!', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@contentpilot.ai' },
    update: {},
    create: {
      name: 'ContentPilot Admin',
      email: 'admin@contentpilot.ai',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@contentpilot.ai' },
    update: {},
    create: {
      name: 'ContentPilot Editor',
      email: 'editor@contentpilot.ai',
      password: editorPassword,
      role: Role.EDITOR,
    },
  });

  console.log(`✅ Admin seeded: ${admin.email} (Role: ${admin.role})`);
  console.log(`✅ Editor seeded: ${editor.email} (Role: ${editor.role})`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
