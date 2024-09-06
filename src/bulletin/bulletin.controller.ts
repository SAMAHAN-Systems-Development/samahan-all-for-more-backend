import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BulletinService } from './bulletin.service';
import { AuthGuard } from '../auth/auth.guard';
import { BulletinDTO } from './createBulletin.dto';
import { ValidateNotSoftDeletePipe } from './bulleting.custom.pipe';

@Controller('/api/bulletins')
export class BulletinController {
  constructor(private readonly bulletinService: BulletinService) {}

  @Post()
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
  async addBulletin(
    @UploadedFiles() pdfAttachments: Express.Multer.File[],
    @Body()
    addBulletinDto: BulletinDTO,
  ) {
    try {
      await this.bulletinService.createBulletin(addBulletinDto, pdfAttachments);

      return {
        statusCode: HttpStatus.CREATED,
        message: pdfAttachments
          ? `Bulletin created successfully, and succesfully uploaded ${pdfAttachments.length}`
          : 'Bulletin created successfully',
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
      await this.bulletinService.updateBulletin(
        id,
        updateBulletin,
        pdfAttachments,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Bulletin Updated',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An unexpected error occurred',
      );
    }
  }
}
