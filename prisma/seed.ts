import { PrismaService } from '../src/prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';

const prisma = new PrismaService();
const supabase = new SupabaseService();

const samplePosters = fs
  .readdirSync(path.resolve(__dirname, '../seed_files/posters'))
  .map((file) => path.resolve(__dirname, '../seed_files/posters', file));

const samplePDFs = fs
  .readdirSync(path.resolve(__dirname, '../seed_files/pdfs'))
  .map((file) => path.resolve(__dirname, '../seed_files/pdfs', file));

async function createImageBucketIfNotExists() {
  try {
    const imageBucketName = process.env.POSTER_IMAGE_BUCKET;

    const { data: buckets, error: listError } = await supabase
      .getSupabase()
      .storage.listBuckets();

    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }

    const bucketExists = buckets.some(
      (bucket) => bucket.name === imageBucketName,
    );

    if (!bucketExists) {
      const { data, error } = await supabase
        .getSupabase()
        .storage.createBucket(imageBucketName, {
          public: false,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/jpg',
            'image/pjpeg',
          ],
        });

      if (error) {
        throw new Error(`Failed to create image bucket: ${error.message}`);
      }

      return `Image bucket created successfully: ${JSON.stringify(data)}`;
    } else {
      return `Image bucket '${imageBucketName}' already exists.`;
    }
  } catch (error) {
    throw new Error(`Error managing image bucket: ${error.message}`);
  }
}

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
  const events = Array.from({ length: 50 }).map(() => {
    const startTime = faker.date.future();
    const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);

    return {
      location_id: faker.helpers.arrayElement(locations).id,
      name: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      registration_link: faker.internet.url(),
      start_time: startTime,
      end_time: endTime,
      created_at: new Date(),
      updated_at: new Date(),
      thumbnail: faker.image.url(),
    };
  });

  await prisma.event.createMany({ data: events });
}

async function uploadPoster(filePath: string, fileName: string) {
  const fileData = fs.readFileSync(filePath);
  const mimeType = mime.lookup(filePath);

  if (
    !mimeType ||
    ![
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/jpg',
      'image/pjpeg',
    ].includes(mimeType)
  ) {
    throw new Error(
      `Unsupported MIME type for file '${fileName}': ${mimeType}`,
    );
  }

  const { data, error } = await supabase
    .getSupabase()
    .storage.from(process.env.POSTER_IMAGE_BUCKET)
    .upload(fileName, fileData, {
      cacheControl: '3600',
      upsert: true,
      contentType: mimeType,
    });

  if (error) {
    throw new Error(`Failed to upload file '${fileName}': ${error.message}`);
  }

  return data.path;
}

async function uploadPDF(filePath: string, fileName: string) {
  const mimeType = mime.lookup(filePath);

  if (mimeType !== 'application/pdf') {
    throw new Error(
      `Unsupported MIME type for file '${fileName}': ${mimeType}`,
    );
  }

  const pdfBucketName = process.env.STORAGE_BUCKET; // Ensure this is the correct bucket for PDFs
  const fileData = fs.readFileSync(filePath);

  // Upload the file to Supabase storage
  const { error } = await supabase
    .getSupabase()
    .storage.from(pdfBucketName)
    .upload(fileName, fileData, {
      cacheControl: '3600',
      upsert: true,
      contentType: mimeType,
    });

  if (error) {
    throw new Error(`Failed to upload PDF '${fileName}': ${error.message}`);
  }

  const fullPdfUrl = `https://${process.env.SUPABASE_URL}/storage/v1/object/public/${pdfBucketName}/${fileName}`;

  return fullPdfUrl;
}

async function seedPosters() {
  const events = await prisma.event.findMany();
  const imageBucketName = process.env.POSTER_IMAGE_BUCKET; // Make sure you get the bucket name

  const posters = await Promise.all(
    samplePosters.map(async (filePath, index) => {
      const fileName = path.basename(filePath);
      const fileUrl = await uploadPoster(filePath, fileName);

      // Construct the full URL for the image based on the Supabase structure
      const fullImageUrl = `https://${process.env.SUPABASE_URL}/storage/v1/object/public/${imageBucketName}/${fileName}`;

      return {
        event_id: events[index % events.length].id,
        image_url: fullImageUrl, // Use the constructed URL here
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
    }),
  );

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
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  }));

  await prisma.bulletin.createMany({ data: bulletins });
}

async function seedPDFAttachments() {
  const bulletins = await prisma.bulletin.findMany();

  const pdfAttachments = await Promise.all(
    samplePDFs.map(async (filePath, index) => {
      const fileName = path.basename(filePath);
      const fileUrl = await uploadPDF(filePath, fileName);

      return {
        bulletin_id: bulletins[index % bulletins.length].id,
        file_path: fileUrl,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
    }),
  );

  await prisma.pDFAttachment.createMany({ data: pdfAttachments });
}

async function main() {
  await createImageBucketIfNotExists();
  await createBucketIfNotExists();
  await seedLocations();
  await seedEvents();
  await seedPosters();
  await seedCategories();
  await seedBulletins();
  await seedPDFAttachments();
  await seedUsers();
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
