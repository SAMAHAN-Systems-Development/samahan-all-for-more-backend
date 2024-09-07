import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { BulletinDTO } from './bulletin.dto';
import { isEmpty } from '../utils/utils';

@Injectable()
export class BulletinService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async createBulletin(
    addBulletinDto: BulletinDTO,
    pdfAttachments: Express.Multer.File[],
  ) {
    return this.prismaService.$transaction(async (tx) => {
      try {
        const bulletin = await tx.bulletin.create({
          data: {
            ...addBulletinDto,
          },
        });
        if (!pdfAttachments) {
          return bulletin;
        }
        for (const pdfAttachment of pdfAttachments) {
          const uniqueFilename = await this.supabaseService.uploadPdftoDb(
            pdfAttachment,
          );

          await tx.pDFAttachment.create({
            data: {
              bulletin_id: bulletin.id,
              file_path: uniqueFilename,
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
    updateBulletinDto: BulletinDTO,
    pdfAttachments: Express.Multer.File[],
  ) {
    return this.prismaService.$transaction(async (tx) => {
      try {
        const { deleted_attachment_ids, ...bulletinData } = updateBulletinDto;
        const updatedBulletin = await tx.bulletin.update({
          where: { id },
          data: {
            ...bulletinData,
          },
        });
        const attachments = [];
        // Check if is there any deleted attachment ids to delete
        // Reducing the query time by doing promise.all to simultaneously update the given ids
        if (!isEmpty(deleted_attachment_ids)) {
          const existingAttachments = await tx.pDFAttachment.findMany({
            where: {
              id: { in: deleted_attachment_ids },
              deleted_at: null,
              bulletin_id: id,
            },
          });
          const existingAttachmentIdsSet = new Set(
            existingAttachments.map((att) => att.id),
          );
          const nonExistingIds = deleted_attachment_ids.filter(
            (id) => !existingAttachmentIdsSet.has(id),
          );
          if (!isEmpty(nonExistingIds)) {
            throw new Error(
              `Attachments with IDs ${nonExistingIds.join(
                ', ',
              )} do not exists to bulletin ID: ${id}`,
            );
          }

          await Promise.all(
            deleted_attachment_ids.map((deleteID) =>
              tx.pDFAttachment.update({
                where: { id: deleteID },
                data: { deleted_at: new Date() },
              }),
            ),
          );
        }
        // Check if there is new pdf attachments
        // Upload all and create new data for pdfAttacment table
        if (!isEmpty(pdfAttachments)) {
          for (const pdfAttachment of pdfAttachments) {
            const uniqueFilename = await this.supabaseService.uploadPdftoDb(
              pdfAttachment,
            );

            const pdfUpdatedData = await tx.pDFAttachment.create({
              data: {
                bulletin_id: updatedBulletin.id,
                file_path: uniqueFilename,
              },
            });
            attachments.push(pdfUpdatedData);
          }
        }
        return {
          data: updatedBulletin,
          attachments: attachments,
        };
      } catch (error) {
        throw error;
      }
    });
  }
}
