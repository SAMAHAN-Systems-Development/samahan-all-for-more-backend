import { PrismaService } from '../src/prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';
import { Bulletin } from '@prisma/client';

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
          public: true,
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
          public: true,
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
  const imageBucketName = process.env.POSTER_IMAGE_BUCKET;

  const emails = [
    'crgreyes@addu.edu.ph',
    'univ.library@addu.edu.ph',
    'theology@addu.edu.ph',
    'careercenter@addu.edu.ph',
    'languagecenter@addu.edu.ph',
    'samahan.sd@addu.edu.ph	',
  ];

  const eventNames = [
    'Samahan Townhall 2024',
    'Bloomsbury Cite Them Right User Training 2024',
    'Sacrament of Confirmation for College Students',
    'Japan Exchange and Teaching (JET) Program Online Information Session',
    'Davao Bisaya Course',
    "SKILLS CABIN: SAMAHAN SysDev Talks & Workshops '24",
  ];

  const descriptions = [
    'The SAMAHAN Townhall 2024 is an essential event designed to foster meaningful dialogue between the SAMAHAN organization and the student body. By initiating a public forum, we open channels of communication that enable us to establish genuine connections with students. This forum serves as a platform for SAMAHAN to share its current initiatives and strategic goals, ensuring that students are well-informed about the efforts and directions being pursued. The transparency and accessibility of this dialogue not only build trust but also empower students to become active participants in shaping the future of their community.',
    'This school year, the University Library and Audio-Visual Center subscribes to Bloomsbury Cite Them Right, an online platform designed to advise students and researchers on how to reference their research sources correctly. Cite Them Right (CTR) is a comprehensive platform that offers a wide range of referencing styles, including APA, Chicago, Harvard, IEEE, and MLA. It also provides guidance on referencing any source, along with articles and videos that address common referencing queries, such as avoiding plagiarism and understanding the differences between secondary and primary sources. CTR and other online databases are available at the Remote Library: https://remotelibrary.addu.edu.ph/. We encourage all the students and faculty to explore and use this new resource to enhance research and teaching-learning experience.',
    'The Theology Department invites our AdDU College students who have not yet received the sacrament of Confirmation to avail of such sacrament on November 11, 2024. Please feel free to contact the department at theology@addu.edu.ph for further queries.',
    "The Japan Exchange and Teaching (JET) Programme, established in 1987, aims to promote grassroots internationalization between Japan and participating countries, including the Philippines. It is one of the biggest exchange programs in the world. The participants are mainly deployed to elementary, junior high, and senior high schools as assistant language teachers (ALTs) to help Japanese teachers in their foreign language classes, particularly English. Others work as coordinators for international relations (CIRs) in local government offices and assist in international exchange activities. More importantly, JET Programme participants act as cultural ambassadors of the Philippines in Japan. The JET Programme offers Filipinos an amazing chance to immerse themselves in Japan's vibrant culture while also sharing the beauty of the Philippines with the local Japanese community. For teachers (and future teachers), this is also a once-in-a-lifetime opportunity to learn about and experience Japan's education system. For more information, download this information packet about the JET Program here - https://bit.ly/JETxADDU_InfoPacket24",
    "Introducing AdDU's first Davao Bisaya Course for all foreign students who want to learn our deep, rich, and unique dialect. Don't miss this incredible opportunity to connect, communicate, and collaborate with our fellow Davaoeños!",
    'There is power in continuous learning and growth. With this, the Department of Systems Development, an organization dedicated to fostering technological growth and innovation within the SAMAHAN and Ateneo community, along with the Office of the SAMAHAN Secretary-General, aims to contribute to a more skills-equipped community through the Skills Cabin. This Skills Cabin segment entitled “SysDev Talks and Workshops” is a capacity building offered to the Ateneans to ensure the quality of work produced regardless of the organization they are serving. This initiative aims to provide its members and interested individuals with valuable insights and practical knowledge on various technology-related concepts. The event is designed to equip participants with skills that are essential in today’s fast-evolving tech landscape, covering areas such as system development and emerging technologies.',
  ];

  const registrationLinks = [
    'https://forms.gle/8CsWW2DNsnJTJXwQ7',
    'https://docs.google.com/forms/d/e/1FAIpQLSfuWmsopGDxkdXKZehFDhhbbzAx6L6eIvBkEPEz5G2Pjycf5Q/viewform?pli=1',
    'https://docs.google.com/forms/d/e/1FAIpQLSfCusnJv1ZmwDew71EGTbaySuTOxn92pe1HcZLnTFxfBEu9Ig/viewform',
    'https://bit.ly/JETxADDU',
    'https://forms.gle/6DM4nj6EikNLF6rKA',
    'https://drive.google.com/file/d/1NDL-lAQWuZHfAbf2ChxCiBR5nkbwFi_5/view?usp=sharing',
  ];

  const departmentNames = [
    'SAMAHAN',
    'University Library',
    'Theology Department, School of Arts and Sciences',
    'Career Center Office',
    'Ateneo de Davao - Language Center',
    'SAMAHAN Systems Development',
  ];

  const startTimes = [
    new Date('2024-10-16T15:40:00'),
    new Date('2024-10-28T16:00:00'),
    new Date('2024-11-11T00:00:00'),
    new Date('2024-10-30T15:40:00'),
    new Date('2024-11-05T09:00:00'),
    new Date('2024-11-11T16:00:00'),
  ];

  const endTimes = [
    new Date('2024-10-16T17:30:00'),
    new Date('2024-10-28T17:00:00'),
    new Date('2024-11-11T23:59:59'),
    new Date('2024-10-30T17:00:00'),
    new Date('2024-11-05T11:00:00'),
    new Date('2024-11-11T17:30:00'),
  ];

  const thumbnailPaths = [
    'seed_files/posters/smhn-logo-white.jpg',
    'seed_files/posters/UNIV_LIB.jpg',
    'seed_files/posters/smhn-logo-white.jpg',
    'seed_files/posters/CCO.jpg',
    'seed_files/posters/LC.jpg',
    'seed_files/posters/SYSDEV.jpg',
  ];

  const events = await Promise.all(
    eventNames.map(async (name, index) => {
      const locationId =
        departmentNames[index] ===
        'Theology Department, School of Arts and Sciences'
          ? null
          : faker.helpers.arrayElement(locations).id;

      const thumbnailPath = thumbnailPaths[index];
      const fileName = path.basename(thumbnailPath);
      const fileUrl = await uploadPoster(thumbnailPath, fileName); // Upload the thumbnail

      const fullImageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${imageBucketName}/${fileName}`;

      return {
        location_id: locationId,
        name: name,
        email: emails[index % emails.length],
        description: descriptions[index],
        registration_link: registrationLinks[index],
        start_time: startTimes[index],
        end_time: endTimes[index],
        created_at: new Date(),
        updated_at: new Date(),
        thumbnail: fullImageUrl, // Save the thumbnail URL
        department_name: departmentNames[index],
      };
    }),
  );

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

  const pdfBucketName = process.env.STORAGE_BUCKET;
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

  const fullPdfUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${pdfBucketName}/${fileName}`;

  return fullPdfUrl;
}

async function seedPosters() {
  const events = await prisma.event.findMany();
  const imageBucketName = process.env.POSTER_IMAGE_BUCKET;

  const posters = await Promise.all(
    samplePosters.map(async (filePath, index) => {
      const fileName = path.basename(filePath);
      const fileUrl = await uploadPoster(filePath, fileName); // Do not remove

      const fullImageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${imageBucketName}/${fileName}`;

      return {
        event_id: events[index % events.length].id,
        image_url: fullImageUrl,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
    }),
  );

  await prisma.poster.createMany({ data: posters });
}

async function seedCategories() {
  const categories: {
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
  }[] = [
    {
      name: 'Bills',
      description: faker.lorem.sentence(),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Memorandums',
      description: faker.lorem.sentence(),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Resolutions',
      description: faker.lorem.sentence(),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await prisma.category.createMany({ data: categories });
}

async function seedBulletins() {
  const bulletinTitles = [
    'A Resolution Creating an Ad Hoc Committee to Convene the Members of the SAMAHAN Student Court',
    'A Resolution Adopting the Magna Carta for Students’ Rights and Welfare and Endorsement to the Office of Student Affairs',
    'A Resolution Confirming the Appointment of Nikko Paul Izack Maghuyop as the Department Director of the SAMAHAN Sponsorship and Support',
    "A Resolution Confirming the Appointment of French Bayer Bandong as the Head Commissioner of Commission on Students' Rights and Welfare",
    'A Resolution Confirming the Appointment of Justin James Carreon as the Department Director of the SAMAHAN Creative Team',
    'A Resolution Confirming the Appointment of Ken Ryle Hinojales as the Department Director of Ateneo SAMAHAN Productions',
    'A Resolution Confirming the Appointment of Alessandra Marie Leyma as the Department Director of the Department of Academic Affairs',
    'A Resolution Confirming the Appointment of Jewel Batoon as the Department Director of the Department of Campaigns and Advocacies',
    'A Resolution Confirming the Appointment of Rustom Olaso as the Department Director of the SAMAHAN Communications',
    'A Resolution Confirming the Appointment of Krisha Faye Barot as the Department Director of the Department of External Affairs',
    'A Resolution Confirming the Appointment of Ralph Rainier Abarca as the Department Director of the SAMAHAN Logistics Department',
    'A Resolution Confirming the Appointment of Aibor Kennen Denila as the Department Director of the SAMAHAN Research and Development',
    'A Resolution Confirming the Appointment of Mary Jastine Lapating as the Department Director of the Ecotoneo Student Unit',
    'A Resolution Confirming the Appointment of Alex Dave Escalante as the Department Director of the Department of Disaster Risk Reduction and Management',
    'A Resolution Confirming the Appointment of Francis Rhaey Casas as the Department Director for the SAMAHAN Systems Development',
    'A Resolution Confirming the Appointment of Jan A.G. Adrian Lariego as the Head Commissioner of Commission on Audit',
    'A Resolution Urging the Ateneo de Davao University Committee on Anti-Sexual Harassment that in Combating Sexual Harassment - to Strengthen Reporting Mechanisms and Support Systems for Ateneo de Davao University Students',
    'A Resolution Urging the Student Executive Councils (SECs) of the Ateneo de Davao University to Strengthen their Student Judicial Court Application Campaign and Modifying Applicant Qualifications',
    'An Act Establishing the SAMAHAN Political Affairs and Engagements Department',
    'An Act Repealing the 2023 Student Assembly Code of Legislative Procedures and Implementing the 2024 Student Assembly Code of Internal Procedures',
  ];

  const bulletinContents = [
    'Resolution No. 001-2425',
    'Resolution No. 002-2425',
    'Resolution No. 003-2425',
    'Resolution No. 004-2425',
    'Resolution No. 005-2425',
    'Resolution No. 006-2425',
    'Resolution No. 007-2425',
    'Resolution No. 008-2425',
    'Resolution No. 009-2425',
    'Resolution No. 010-2425',
    'Resolution No. 011-2425',
    'Resolution No. 012-2425',
    'Resolution No. 014-2425',
    'Resolution No. 015-2425',
    'Resolution No. 016-2425',
    'Resolution No. 017-2425',
    'Resolution No. 018-2425',
    'Resolution No. 019-2425',
    'SAMAHAN Act No. 1 of 2024',
    'SAMAHAN Act No. 2 of 2024',
  ];

  const categories = await prisma.category.findMany();

  const bulletins: Omit<Bulletin, 'id'>[] = bulletinTitles.map(
    (title, index) => ({
      title,
      content: bulletinContents[index],
      category_id: faker.helpers.arrayElement(categories).id,
      author: faker.name.fullName(),
      created_at: new Date(),
      updated_at: new Date(),
      published_at: new Date(),
      deleted_at: null,
    }),
  );

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
  // TODO: No sample data available for events with multiple images. Uncomment and configure seedPosters() when sample data is provided.
  // await seedPosters();
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
