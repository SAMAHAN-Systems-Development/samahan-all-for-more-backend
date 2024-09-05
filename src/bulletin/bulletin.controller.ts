import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BulletinService } from './bulletin.service';
import { AuthGuard } from '../auth/auth.guard';
import { BulletinDTO } from './bulletin.dto';
import { ValidateNotSoftDeletePipe } from './bulleting.custom.pipe';
import { createMessagePart, isEmpty } from '../utils/utils';
import { Bulletin } from '@prisma/client';

@Controller('/api/bulletins')
@UseGuards(AuthGuard)
export class BulletinController {
  constructor(private readonly bulletinService: BulletinService) {}

  @Get()
  async getAllBulletins(
    @Query() query: { page: number; limit?: number },
  ): Promise<Bulletin[]> {
    const { page = 1, limit = 10 } = query;
    return this.bulletinService.getAllBulletins(Number(page), Number(limit));
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @UseInterceptors(
    FilesInterceptor('pdf_attachments', undefined, {
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/\/(pdf)$/)) {
          return callback(
            new BadRequestException('Only PDF files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async addBulletin(
    @UploadedFiles() pdfAttachments: Express.Multer.File[],
    @Body()
    addBulletinDto: BulletinDTO,
  ) {
    try {
      await this.bulletinService.createBulletin(addBulletinDto, pdfAttachments);
      const message = [
        'Bulletin created successfully',
        createMessagePart(
          pdfAttachments.length,
          'Added',
          'PDF attachment',
          'PDF attachments',
        ),
      ]
        .filter(Boolean)
        .join(' ');

      return {
        statusCode: HttpStatus.CREATED,
        message: isEmpty(pdfAttachments)
          ? 'Bulletin created successfully'
          : `Bulletin created successfully, and succesfully uploaded ${pdfAttachments.length}`,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        // Fallback to a generic 500 error
        throw new InternalServerErrorException(
          error.message || 'An unexpected error occurred',
        );
      }
    }
  }

<<<<<<< HEAD
  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @UseInterceptors(
    FilesInterceptor('pdf_attachments', undefined, {
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/\/(pdf)$/)) {
          return callback(
            new BadRequestException('Only PDF files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async updateBulletin(
    @Param('id', ParseIntPipe, ValidateNotSoftDeletePipe) id: number,
    @UploadedFiles() pdfAttachments: Express.Multer.File[],
    @Body()
    updateBulletin: BulletinDTO,
  ) {
    try {
      const { data, attachments } = await this.bulletinService.updateBulletin(
        id,
        updateBulletin,
        pdfAttachments,
      );
      data['attachments'] = attachments;
      const message = [
        'Bulletin updated successfully',
        createMessagePart(
          attachments.length,
          'Added',
          'PDF attachment',
          'PDF attachments',
        ),
        createMessagePart(
          updateBulletin.deleted_attachment_ids?.length || 0,
          'Deleted',
          'attachment',
          'attachments',
        ),
      ]
        .filter(Boolean)
        .join(' ');

      return {
        statusCode: HttpStatus.OK,
        message: message,
        data: data,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An unexpected error occurred',
      );
    }
  }


  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBulletin(@Param('id', ParseIntPipe) id: number) {
    return this.bulletinService.deleteBulletin(id);
  }
}
