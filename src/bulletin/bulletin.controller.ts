import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Import FileInterceptor from the correct module
import { BulletinService } from './bulletin.service';
import { AuthGuard } from '../auth/auth.guard';
import { AddBulletinDTO } from './bulletin.dto';

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
  @UseInterceptors(FileInterceptor('pdf_attachment'))
  async addBulletin(
    @UploadedFile() pdf_attachment: Express.Multer.File,
    @Body()
    addBulletinDto: AddBulletinDTO,
  ) {
    try {
      if (pdf_attachment.mimetype !== 'application/pdf') {
        throw new BadRequestException('Only PDF file are only allowed');
      }

      const result = await this.bulletinService.addBulletin(
        addBulletinDto,
        pdf_attachment,
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Bulletin created successfully',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred',
        error: error.message,
      };
    }
  }
}
