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
  const locations = [
    {
      name: 'Arrupe Hall',
      address: '',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Miguel Library Learning Commons (MPLC)',
      address:
        'Ateneo de Davao University, 2F CCFC Bldg, Roxas Ave., Davao City',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'TBA',
      address: 'Venue will be announced in the emails of the registrants',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'via Zoom',
      address: '',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Ateneo Language Center',
      address: '5/F F513',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Conference Room D',
      address: '3rd Floor, Ricci Hall, CCFC Building',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Bapa Benny Tudtud Auditorium',
      address: '',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Ateneo de Davao University',
      address: '',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Miguel Pro Learning Commons Multipurpose Room (MPR)',
      address:
        '2nd Floor of the Community Center of the First Companions, ADDU Jacinto Campus.',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'MPR, Miguel Pro Learning Commons',
      address:
        'Those who cannot join the onsite training may opt to attend via Zoom.',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

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
    'careercenter@addu.edu.ph',
    'univ.library@addu.edu.ph',
    'abka@addu.edu.ph',
    'samahan.academicaffairs@addu.edu.ph',
    'samahan.productions@addu.edu.ph',
    'ADDUFASEC2425@gmail.com',
    'ADDUFASEC2425@gmail.com',
  ];

  const eventNames = [
    'Samahan Townhall 2024',
    'Bloomsbury Cite Them Right User Training 2024',
    'Sacrament of Confirmation for College Students',
    'Japan Exchange and Teaching (JET) Program Online Information Session',
    'Davao Bisaya Course',
    "SKILLS CABIN: SAMAHAN SysDev Talks & Workshops '24",
    'Information Session on Studying in Australia',
    'User Training on EBSCOHost Research Databases',
    'The 𝟮𝗻𝗱 𝗕𝗹𝘂𝗲 𝗞𝗻𝗶𝗴𝗵𝘁𝘀 𝗟𝗲𝗮𝗱𝗲𝗿𝘀𝗵𝗶𝗽 𝗖𝗼𝗻𝗳𝗲𝗿𝗲𝗻𝗰𝗲',
    'Level Up for Finals: The SAMAHAN DAA Tutorials',
    'Set the Stage: Event Production 101 Workshop',
    '𝐖𝐨𝐫𝐤𝐩𝐥𝐚𝐜𝐞 𝟏𝟎𝟏: 𝐋𝐚𝐛𝐨𝐫 𝐋𝐚𝐰𝐬 𝐄𝐯𝐞𝐫𝐲 𝐅𝐫𝐞𝐬𝐡 𝐆𝐫𝐚𝐝𝐮𝐚𝐭𝐞 𝐒𝐡𝐨𝐮𝐥𝐝 𝐊𝐧𝐨𝐰',
    'Live Secured: Safeguarding Your Future',
  ];

  const descriptions = [
    'The SAMAHAN Townhall 2024 is an essential event designed to foster meaningful dialogue between the SAMAHAN organization and the student body. By initiating a public forum, we open channels of communication that enable us to establish genuine connections with students. This forum serves as a platform for SAMAHAN to share its current initiatives and strategic goals, ensuring that students are well-informed about the efforts and directions being pursued. The transparency and accessibility of this dialogue not only build trust but also empower students to become active participants in shaping the future of their community.',

    'This school year, the University Library and Audio-Visual Center subscribes to Bloomsbury Cite Them Right, an online platform designed to advise students and researchers on how to reference their research sources correctly. Cite Them Right (CTR) is a comprehensive platform that offers a wide range of referencing styles, including APA, Chicago, Harvard, IEEE, and MLA. It also provides guidance on referencing any source, along with articles and videos that address common referencing queries, such as avoiding plagiarism and understanding the differences between secondary and primary sources. CTR and other online databases are available at the Remote Library: https://remotelibrary.addu.edu.ph/. We encourage all the students and faculty to explore and use this new resource to enhance research and teaching-learning experience.',

    'The Theology Department invites our AdDU College students who have not yet received the sacrament of Confirmation to avail of such sacrament on November 11, 2024. Please feel free to contact the department at theology@addu.edu.ph for further queries.',

    "The Japan Exchange and Teaching (JET) Programme, established in 1987, aims to promote grassroots internationalization between Japan and participating countries, including the Philippines. It is one of the biggest exchange programs in the world. The participants are mainly deployed to elementary, junior high, and senior high schools as assistant language teachers (ALTs) to help Japanese teachers in their foreign language classes, particularly English. Others work as coordinators for international relations (CIRs) in local government offices and assist in international exchange activities. More importantly, JET Programme participants act as cultural ambassadors of the Philippines in Japan. The JET Programme offers Filipinos an amazing chance to immerse themselves in Japan's vibrant culture while also sharing the beauty of the Philippines with the local Japanese community. For teachers (and future teachers), this is also a once-in-a-lifetime opportunity to learn about and experience Japan's education system. For more information, download this information packet about the JET Program here - https://bit.ly/JETxADDU_InfoPacket24",

    "Introducing AdDU's first Davao Bisaya Course for all foreign students who want to learn our deep, rich, and unique dialect. Don't miss this incredible opportunity to connect, communicate, and collaborate with our fellow Davaoeños!",

    'There is power in continuous learning and growth. With this, the Department of Systems Development, an organization dedicated to fostering technological growth and innovation within the SAMAHAN and Ateneo community, along with the Office of the SAMAHAN Secretary-General, aims to contribute to a more skills-equipped community through the Skills Cabin. This Skills Cabin segment entitled “SysDev Talks and Workshops” is a capacity building offered to the Ateneans to ensure the quality of work produced regardless of the organization they are serving. This initiative aims to provide its members and interested individuals with valuable insights and practical knowledge on various technology-related concepts. The event is designed to equip participants with skills that are essential in today’s fast-evolving tech landscape, covering areas such as system development and emerging technologies.',

    'Learn how to acquire globally recognized qualifications as we hear from representatives of the following institutions:\n\n- Western Sydney College\n- TKL College\n- Australian Harbour International College\n- National Academy of Professional Studies',

    "EBSCOHost is the biggest online platform among the university's subscriptions. It offers access to discovery service, multi-disciplinary peer-reviewed journals, and academic e-books on the following:\n\n- Academic Search Complete (Multidisciplinary e-journals)\n- Academic e-Books Collection\n- American Theological Library Association (ATLA) Religion Database with Full Text\n- Biomedical Reference Collection: Basic\n- Business Source Complete\n- Cumulated Index in Nursing and Allied Health Literature (CINAHL) with Full Text\n- Communication and Mass Media Complete\n- Computer Source\n- Computers and Applied Sciences Complete\n- Funk & Wagnalls New World Encyclopedia\n- eBook Academic Collection\n- Education Research Complete\n- Education Resource Information Center (ERIC)\n- GreenFile\n- Humanities International Complete\n- Literary Reference Source\n- MAS Ultra - School Edition\n- MEDLine\n- Military and Government Collection\n- Regional Business News\n- Religion and Philosophy Collection\n- Sociology Index (SocIndex) with Full Text\n\nThe University Library encourages all the students and faculty to explore and use the available electronic resources to enhance the research and the teaching-learning experience.",

    "The 2nd Blue Knight Leadership Conference, themed 'Voices of Change: Media, Civil Society, Innovation, and Youth Leadership in Mindanao's Future,' seeks to empower the youth to drive sustainable development and social change within Mindanao. This conference provides a platform for young leaders to engage with pressing issues, focusing on how media, civil society, and innovative leadership intersect to shape the region's future. By fostering collaboration and sharing insights, this event aims to build a generation of proactive leaders equipped to create a more inclusive, just, and resilient Mindanao.",

    "The SAMAHAN Department of Academic Affairs presents 'Level Up for Finals: The SAMAHAN DAA Tutorials.' This initiative is a direct response to student feedback regarding the challenges encountered in certain GE courses and aims to provide targeted academic support to enhance student performance in the upcoming Finals examinations.",

    "The event aims to equip students from different organizations and Student Executive Councils with essential event production skills. Whether you're a seasoned production team member or just starting out, this workshop will help you become more proficient in organizing and managing events on campus.",

    'Start your career with confidence! Learn the essentials of labor laws—your rights, benefits, and protections in the workplace. Equip yourself to make informed decisions and avoid common pitfalls as a new employee. Don’t miss this chance to start strong!',

    'Starting your career journey? Make sure you’re informed about the SSS essentials that protect you as you step into the workforce! Here are some important things every fresh graduate should know about the Social Security System (SSS) in the Philippines.',
  ];

  const registrationLinks = [
    'https://forms.gle/8CsWW2DNsnJTJXwQ7',
    'https://docs.google.com/forms/d/e/1FAIpQLSfuWmsopGDxkdXKZehFDhhbbzAx6L6eIvBkEPEz5G2Pjycf5Q/viewform?pli=1',
    'https://docs.google.com/forms/d/e/1FAIpQLSfCusnJv1ZmwDew71EGTbaySuTOxn92pe1HcZLnTFxfBEu9Ig/viewform',
    'https://bit.ly/JETxADDU',
    'https://forms.gle/6DM4nj6EikNLF6rKA',
    'https://drive.google.com/file/d/1NDL-lAQWuZHfAbf2ChxCiBR5nkbwFi_5/view?usp=sharing',
    'https://bit.ly/ADDUxAUS_InfoSession',
    'https://tinyurl.com/yc3hm6ka',
    'http://bit.ly/4fdVgBn ',
    'https://tinyurl.com/LevelUpGERegistration',
    'https://tinyurl.com/SetTheStage2024',
    'https://tinyurl.com/Workplace101',
    'https://bit.ly/LiveSecured',
  ];

  const departmentNames = [
    'SAMAHAN',
    'University Library',
    'Theology Department, School of Arts and Sciences',
    'Career Center Office',
    'Ateneo de Davao - Language Center',
    'SAMAHAN Systems Development',
    'Career Center Office',
    'University Library',
    '𝘈𝘵𝘦𝘯𝘦𝘰 𝘥𝘦 𝘋𝘢𝘷𝘢𝘰 𝘉𝘭𝘶𝘦 𝘒𝘯𝘪𝘨𝘩𝘵 𝘈𝘴𝘴𝘰𝘤𝘪𝘢𝘵𝘪𝘰𝘯',
    'SAMAHAN Department of Academic Affairs',
    'Ateneo SAMAHAN Productions',
    'Bachelor of Science in Accountancy - 4A',
    'Bachelor of Science in Accountancy - 4A',
  ];

  const Locations = [1, 2, 3, 4, 5, 6, 9, 10, 8, 3, 3, 7, 7];

  const startTimes = [
    new Date('2024-10-16T15:40:00'),
    new Date('2024-10-28T16:00:00'),
    new Date('2024-11-11T00:00:00'),
    new Date('2024-10-30T15:40:00'),
    new Date('2024-11-05T09:00:00'),
    new Date('2024-11-11T16:00:00'),
    new Date('2014-11-13T15:40:00'),
    new Date('2024-11-19T14:00:00'),
    new Date('2024-11-23T15:40:00'),
    new Date('2024-11-11T15:40:00'),
    new Date('2024-11-13T15:40:00'),
    new Date('2024-11-16T14:00:00'),
    new Date('2024-11-16T08:00:00'),
  ];

  const endTimes = [
    new Date('2024-10-16T17:30:00'),
    new Date('2024-10-28T17:00:00'),
    new Date('2024-11-11T23:59:59'),
    new Date('2024-10-30T17:00:00'),
    new Date('2024-11-05T11:00:00'),
    new Date('2024-11-11T17:30:00'),
    new Date('2014-11-13T17:00:00'),
    new Date('2024-11-19T15:30:00'),
    new Date('2024-11-23T17:40:00'),
    new Date('2024-11-11T17:40:00'),
    new Date('2024-11-13T17:40:00'),
    new Date('2024-11-16T17:00:00'),
    new Date('2024-11-16T12:00:00'),
  ];

  const thumbnailPaths = [
    'smhn-logo-white.jpg',
    'UNIV_LIB.jpg',
    'smhn-logo-white.jpg',
    'CCO.jpg',
    'LC.jpg',
    'SYSDEV.jpg',
    'CAREER_CENTER_OFFICE.png',
    'UNIVLIB.png',
    'BKLC.jpg',
    'DAA.jpg',
    'ASP.jpg',
    'FASEC.jpg',
    'LIVE_SECURED.jpg',
  ];

  const events = await Promise.all(
    eventNames.map(async (name, index) => {
      const thumbnailPath = thumbnailPaths[index];
      const fileName = path.basename(thumbnailPath);
      const fileUrl = await uploadPoster(
        `seed_files/posters/${thumbnailPath}`,
        fileName,
      ); // Do not remove
      const fullImageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${imageBucketName}/${fileName}`;
      const location = locations[index % locations.length];

      return {
        location_id: Locations[index],
        name: name,
        email: emails[index % emails.length],
        description: descriptions[index],
        registration_link: registrationLinks[index],
        start_time: startTimes[index],
        end_time: endTimes[index],
        created_at: new Date(),
        updated_at: new Date(),
        thumbnail: fullImageUrl,
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
      name: 'Acts',
      description:
        'A piece of legislation used to create policy in order to carry out the principles of the SAMAHAN Constitution. It is crafted and passed by the Student Assembly and approved by the SAMAHAN President. It can only be repealed by a similar act of the Assembly.',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Memorandums',
      description:
        'Official communications issued by the SAMAHAN to convey important information, directives, or updates to members, ensuring transparency and awareness of relevant matters within the organization.',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Resolutions',
      description:
        'A piece of legislation that serves as official statements adopted by the Student Assembly to address issues impacting the student body. They reflect unified stances on specific concerns, advocating for reforms in university policies and practices. Resolutions are also used by the Student Assembly to affirm or reject appointments.',
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
    'A Resolution Confirming the Appointment of Alex Dave Escalante as the Department Director of the Department of Disaster Risk Reduction and Management',
    'A Resolution Confirming the Appointment of Francis Rhaey Casas as the Department Director for the SAMAHAN Systems Development',
    'A Resolution Confirming the Appointment of Jan A.G. Adrian Lariego as the Head Commissioner of Commission on Audit',
    'A Resolution Endorsing the Cluster Participation Incentive Mechanism for Students in the Natural Sciences and Mathematics Cluster',
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

  const publishedDates = [
    new Date('2024-09-04T09:00:00'),
    new Date('2024-09-04T09:00:00'),
    new Date('2024-09-21T09:00:00'),
    new Date('2024-09-21T09:00:00'),
    new Date('2024-09-21T09:00:00'),
    new Date('2024-09-21T09:00:00'),
    new Date('2024-09-21T09:00:00'),
    new Date('2024-09-21T09:00:00'),
    new Date('2024-09-21T09:00:00'),
    new Date('2024-09-21T09:00:00'),
    new Date('2024-09-21T09:00:00'),
    new Date('2024-09-21T09:00:00'),
    new Date('2024-09-21T09:00:00'),
    new Date('2024-09-21T09:00:00'),
    new Date('2024-10-05T09:00:00'),
    new Date('2024-10-05T09:00:00'),
    new Date('2024-10-05T09:00:00'),
    new Date('2024-10-16T09:00:00'),
    new Date('2024-10-08T09:00:00'),
    new Date('2024-10-14T09:00:00'),
  ];

  const bulletinCategories = [
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Resolutions',
    'Acts',
    'Acts',
  ];

  const author = 'Office of the Legislative Secretary';

  const categories = await prisma.category.findMany();

  const categoryMap = categories.reduce((map, category) => {
    map[category.name] = category.id;
    return map;
  }, {});

  const bulletins: Omit<Bulletin, 'id'>[] = bulletinTitles.map(
    (title, index) => ({
      title,
      content: bulletinContents[index],
      category_id: categoryMap[bulletinCategories[index]],
      author,
      created_at: new Date(),
      updated_at: new Date(),
      published_at: publishedDates[index],
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
