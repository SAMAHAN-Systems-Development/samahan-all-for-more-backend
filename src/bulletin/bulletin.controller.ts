import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Import FileInterceptor from the correct module
import { BulletinService } from './bulletin.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/api/bulletins')
export class BulletinController {
  constructor(private readonly bulletinService: BulletinService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('pdf_attachment'))
  async addBulletin(
    @UploadedFile() pdf_attachment: Express.Multer.File,
    @Body()
    body: any,
  ) {
    const cathegory_id = body['cathegory_id'];

    const parsedCathegoryId = isNaN(Number(cathegory_id))
      ? null
      : Number(cathegory_id);

    const addBulletinDto = {
      category_id: parsedCathegoryId,
      title: body['title'],
      author: body['author'],
      content: body['content'],
    };

    try {
      if (
        addBulletinDto.category_id <= 0 ||
        !addBulletinDto.title ||
        !addBulletinDto.author ||
        !addBulletinDto.content
      ) {
        throw new BadRequestException('Invalid valid fields');
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
