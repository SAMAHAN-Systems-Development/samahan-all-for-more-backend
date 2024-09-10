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

        const uploadedAttachements = await this.uploadAttachements(
          pdfAttachments,
          bulletin.id,
        );

        await tx.pDFAttachment.createMany({
          data: uploadedAttachements,
        });

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

        // Edge Case
        if (!isEmpty(deleted_attachment_ids)) {
          const existingAttachments = await tx.pDFAttachment.findMany({
            where: {
              id: { in: deleted_attachment_ids },
              deleted_at: null,
              bulletin_id: id,
            },
          });
          const existingAttachmentIdsSet = existingAttachments.map(
            (att) => att.id,
          );

          const nonExistingIds = deleted_attachment_ids.filter(
            (id) => !existingAttachmentIdsSet.includes(id),
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

        const attachments = [];

        if (!isEmpty(pdfAttachments)) {
          const uploadedAttachements = await this.uploadAttachements(
            pdfAttachments,
            updatedBulletin.id,
          );

          await tx.pDFAttachment.createMany({
            data: uploadedAttachements,
          });
          attachments.push(uploadedAttachements);
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

  async uploadAttachements(pdfAttachments, bulletinID) {
    const urls = await Promise.all(
      pdfAttachments.map(async (pdfAttachment) => {
        const fileUrl = await this.supabaseService.uploadPdftoDb(pdfAttachment);
        return fileUrl;
      }),
    );

    const uploadedAttachements = urls.map((url) => ({
      bulletin_id: bulletinID,
      file_path: url,
    }));

    return uploadedAttachements;
  }

  async deleteBulletin(id: number) {
    return this.prismaService.$transaction(async (tx) => {
      try {
        const dateNow = new Date();

        await tx.bulletin.update({
          where: { id },
          data: {
            deleted_at: dateNow,
          },
        });

        await tx.pDFAttachment.updateMany({
          where: { bulletin_id: id },
          data: { deleted_at: dateNow },
        });

        return {
          message: 'Bulletin successfully deleted',
        };
      } catch (error) {
        throw error;
      }
    });
  }
}
