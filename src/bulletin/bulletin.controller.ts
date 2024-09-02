import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'; // Import FileInterceptor from the correct module
import { BulletinService } from './bulletin.service';
import { AuthGuard } from '../auth/auth.guard';
import { AddBulletinDTO } from './createBulletin.dto';
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
    @UploadedFile() pdfAttachments: Express.Multer.File[],
    @Body()
    addBulletinDto: AddBulletinDTO,
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
}
