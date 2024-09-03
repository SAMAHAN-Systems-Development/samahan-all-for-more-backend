import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { AddBulletinDTO, UpdateBulletinDTO } from './createBulletin.dto';

@Injectable()
export class BulletinService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

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

  async updateBulletin(
    id: number,
    updateBulletinDto: UpdateBulletinDTO,
    pdfAttachments: Express.Multer.File[],
  ) {
    return this.prismaService.$transaction(async (tx) => {
      try {
        const updatedBulletin = await tx.bulletin.update({
          where: { id },
          data: {
            category_id: updateBulletinDto.category_id,
            title: updateBulletinDto.title,
            content: updateBulletinDto.content,
            author: updateBulletinDto.author,
          },
        });

        if (pdfAttachments && pdfAttachments.length > 0) {
          // This remove old records
          const oldAttachments = await tx.pDFAttachment.findMany({
            where: { bulletin_id: id, deleted_at: null },
          });

          for (const attachment of oldAttachments) {
            const references = await tx.bulletin.findMany({
              where: {
                pdfAttachments: { some: { id: attachment.id } },
                deleted_at: null,
              },
            });

            if (references.length === 0) {
              const { error } = await this.supabaseService
                .getSupabase()
                .storage.from(process.env.STORAGE_BUCKET)
                .remove([attachment.file_path]);

              if (error) {
                throw new Error(`Failed to remove old file: ${error.message}`);
              }
            }
          }

          await tx.pDFAttachment.updateMany({
            where: { bulletin_id: id },
            data: { deleted_at: new Date() },
          });

          // This create new records
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

            const { error: uploadError } = await this.supabaseService
              .getSupabase()
              .storage.from(process.env.STORAGE_BUCKET)
              .upload(uniqueFileName, pdfAttachment.buffer, {
                contentType: 'application/pdf',
                cacheControl: '3600',
                upsert: true,
              });

            if (uploadError) {
              throw new Error(
                `Failed to upload new file: ${uploadError.message}`,
              );
            }

            await tx.pDFAttachment.create({
              data: {
                bulletin_id: updatedBulletin.id,
                file_path: filePath,
              },
            });
          }
        }
        return updatedBulletin;
      } catch (error) {
        throw error;
      }
    });
  }
}
