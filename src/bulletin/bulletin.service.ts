import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { AddBulletinDTO } from './bulletin.dto';

@Injectable()
export class BulletinService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async addBulletin(
    addBulletinDto: AddBulletinDTO,
    pdf_attachment: Express.Multer.File,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      try {
        const bulletin = await tx.bulletin.create({
          data: {
            category_id: addBulletinDto.category_id,
            title: addBulletinDto.title,
            content: addBulletinDto.content,
            author: addBulletinDto.author,
          },
        });
        if (!pdf_attachment) {
          return bulletin;
        }

        const uniqueFileName = `${Date.now()}-${pdf_attachment.originalname}`;
        const filePath = uniqueFileName;

        const { error } = await this.supabaseService
          .getSupabase()
          .storage.from(process.env.STORAGE_BUCKET)
          .upload(uniqueFileName, pdf_attachment.buffer, {
            contentType: 'application/pdf',
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          throw new Error(`Failed to upload file: ${error.message}`);
        }

        const pDFAttachment = await tx.pDFAttachment.create({
          data: {
            bulletin_id: bulletin.id,
            file_path: filePath,
          },
        });

        return { ...bulletin, pDFAttachment };
      } catch (error) {
        console.error(error.message);
        throw new Error('An error occurred while uploading the PDF');
      }
    });
  }
}
