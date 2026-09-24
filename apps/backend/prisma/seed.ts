import bcrypt from 'bcryptjs';
import { PrismaClient, Role, ContentType, ContentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding initial ContentPilot users and content...');

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

  // Seed sample published articles
  const item1 = await prisma.contentItem.upsert({
    where: { slug: 'headless-cms-architecture' },
    update: {},
    create: {
      title: 'Modern Headless CMS Architecture',
      slug: 'headless-cms-architecture',
      type: ContentType.BLOG_POST,
      status: ContentStatus.PUBLISHED,
      createdBy: editor.id,
      versions: {
        create: {
          versionNo: 1,
          bodyJson: {
            title: 'Modern Headless CMS Architecture',
            subtitle: 'Decoupling Presentation from Content Layer',
            content: 'Headless CMS architecture decouples presentation layer from content storage, enabling multi-channel delivery across web, mobile, and IoT devices with high performance.',
            author: 'ContentPilot Team',
            readTime: '4 min read',
            tags: ['Architecture', 'Headless CMS', 'Next.js']
          },
          metaJson: {
            seoScore: 94,
            description: 'Learn how modern headless CMS architecture decouples content storage from presentation layers.'
          }
        }
      }
    }
  });

  const item2 = await prisma.contentItem.upsert({
    where: { slug: 'enterprise-agentic-personalization' },
    update: {},
    create: {
      title: 'Enterprise Agentic Personalization Guide',
      slug: 'enterprise-agentic-personalization',
      type: ContentType.LANDING_PAGE,
      status: ContentStatus.PUBLISHED,
      createdBy: editor.id,
      versions: {
        create: {
          versionNo: 1,
          bodyJson: {
            title: 'Enterprise Agentic Personalization Guide',
            subtitle: 'Real-Time Edge Content Delivery with AI Agents',
            content: 'Deliver customized hero headlines and targeted CTAs to audience segments using automated rule engines and agentic workflows.',
            author: 'Devansh Gupta',
            readTime: '6 min read',
            tags: ['Personalization', 'AI Agents', 'Target']
          },
          metaJson: {
            seoScore: 92,
            description: 'A comprehensive guide to building agentic personalization engines for modern digital experiences.'
          }
        }
      }
    }
  });

  console.log(`✅ Seeded content items: ${item1.slug}, ${item2.slug}`);

  // Seed initial audience segments
  const seg1 = await prisma.segment.upsert({
    where: { name: 'First-Time Visitors' },
    update: {},
    create: {
      name: 'First-Time Visitors',
      ruleJson: { isNew: true },
    }
  });

  const seg2 = await prisma.segment.upsert({
    where: { name: 'Search Traffic (Google)' },
    update: {},
    create: {
      name: 'Search Traffic (Google)',
      ruleJson: { referrerContains: 'google' },
    }
  });

  console.log(`✅ Seeded segments: ${seg1.name}, ${seg2.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
