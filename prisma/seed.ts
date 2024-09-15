import { PrismaService } from '../src/prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { faker } from '@faker-js/faker';

const prisma = new PrismaService();
const supabase = new SupabaseService();

async function createBucketIfNotExists() {
  try {
    const bucketName = process.env.STORAGE_BUCKET;
    // List all buckets
    const { data: buckets, error: listError } = await supabase
      .getSupabase()
      .storage.listBuckets();
    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }

    // Check if the bucket already exists
    const bucketExists = buckets.some((bucket) => bucket.name === bucketName);

    if (!bucketExists) {
      // Create the bucket if it does not exist
      const { data, error } = await supabase
        .getSupabase()
        .storage.createBucket(bucketName, {
          public: false,
          allowedMimeTypes: ['application/pdf'],
        });

      if (error) {
        throw new Error(`Failed to create bucket: ${error.message}`);
      }

      console.log('Bucket created successfully:', data);
    } else {
      console.log('Bucket already exists');
    }
  } catch (error) {
    console.error('Error managing bucket:', error);
  }
}

async function seedUsers() {
  const users = [
    {
      email: 'ivan@gmail.com',
      password: 'secretPassword',
      userType: 'admin',
    },
    {
      email: 'ivan2@gmail.com',
      password: 'secretPassword',
      userType: 'facilitator',
    },
    {
      email: 'ivan3@gmail.com',
      password: 'secretPassword',
      userType: 'cashier',
    },
  ];

  const userList = [];

  for (const userData of users) {
    const { user, error } = await supabase.createSupabaseUser(
      userData.email,
      userData.password,
    );

    if (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }

    userList.push({
      email: userData.email,
      userType: userData.userType,
      supabaseUserId: user.id,
    });
  }

  await prisma.user.createMany({ data: userList });
}

async function seedLocations() {
  const uniqueNames = new Set<string>();
  const locations: {
    name: string;
    address: string;
    created_at: Date;
    updated_at: Date;
  }[] = [];

  while (uniqueNames.size < 10) {
    const name = faker.location.street();
    if (!uniqueNames.has(name)) {
      uniqueNames.add(name);
      locations.push({
        name,
        address: faker.location.streetAddress(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  await prisma.location.createMany({ data: locations });
}

async function seedEvents() {
  const locations = await prisma.location.findMany();
  const events = Array.from({ length: 50 }).map(() => ({
    location_id: faker.helpers.arrayElement(locations).id,
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    registration_link: faker.internet.url(),
    start_time: faker.date.future(),
    end_time: faker.date.future(),
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await prisma.event.createMany({ data: events });
}

async function seedPosters() {
  const events = await prisma.event.findMany();
  const posters = Array.from({ length: 50 }).map(() => ({
    event_id: faker.helpers.arrayElement(events).id,
    image_url: faker.image.url(),
    description: faker.lorem.sentence(),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  }));

  await prisma.poster.createMany({ data: posters });
}

async function seedCategories() {
  const uniqueNames = new Set<string>();
  const categories: {
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
  }[] = [];

  while (uniqueNames.size < 10) {
    const name = faker.commerce.department();
    if (!uniqueNames.has(name)) {
      uniqueNames.add(name);
      categories.push({
        name,
        description: faker.lorem.sentence(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  await prisma.category.createMany({ data: categories });
}

async function seedBulletins() {
  const categories = await prisma.category.findMany();
  const bulletins = Array.from({ length: 50 }).map(() => ({
    category_id: faker.helpers.arrayElement(categories).id,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    author: faker.person.fullName(),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  }));

  await prisma.bulletin.createMany({ data: bulletins });
}

async function seedPDFAttachments() {
  const bulletins = await prisma.bulletin.findMany();
  const pdfAttachments = Array.from({ length: 50 }).map(() => ({
    bulletin_id: faker.helpers.arrayElement(bulletins).id,
    file_path: faker.system.filePath(),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  }));

  await prisma.pDFAttachment.createMany({ data: pdfAttachments });
}

async function main() {
  await createBucketIfNotExists();
  await seedUsers();
  await seedLocations();
  await seedEvents();
  await seedPosters();
  await seedCategories();
  await seedBulletins();
  await seedPDFAttachments();
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
