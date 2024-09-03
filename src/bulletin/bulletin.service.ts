import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { AddBulletinDTO } from './createBulletin.dto';

@Injectable()
export class BulletinService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async getAllBulletins(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.prismaService.bulletin.findMany({
      skip,
      take: limit,
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        pdfAttachments: {
          where: {
            deleted_at: null,
          },
        },
        category: true,
      },
    });
  }

  async createBulletin(
    addBulletinDto: AddBulletinDTO,
    pdfAttachments: Express.Multer.File[],
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
        if (!pdfAttachments) {
          return bulletin;
        }
        for (const pdfAttachment of pdfAttachments) {
          const now = new Date();
          const formattedDate = `${String(now.getDate()).padStart(
            2,
            '0',
          )}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${now.getFullYear()}`;
          const sanitizedFileName = pdfAttachment.originalname
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9.-]/g, '');
          const uniqueFileName = `${formattedDate}-${sanitizedFileName}`;
          const filePath = uniqueFileName;

          const { error } = await this.supabaseService
            .getSupabase()
            .storage.from(process.env.STORAGE_BUCKET)
            .upload(uniqueFileName, pdfAttachment.buffer, {
              contentType: 'application/pdf',
              cacheControl: '3600',
              upsert: true,
            });

          if (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
          }

          await tx.pDFAttachment.create({
            data: {
              bulletin_id: bulletin.id,
              file_path: filePath,
            },
          });
        }

        return bulletin;
      } catch (error) {
        throw error;
      }
    });
  }
}
