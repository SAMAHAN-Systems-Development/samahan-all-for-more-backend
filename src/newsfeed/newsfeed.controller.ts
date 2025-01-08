import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { NewsfeedService } from './newsfeed.service';
import { CreateNewsfeedDto } from './create-newsfeed.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { isEmpty } from 'lodash';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

@Controller('/newsfeed')
export class NewsfeedController {
  constructor(private readonly newsfeedService: NewsfeedService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images' }], {
      fileFilter: (req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              `Invalid file type: ${file.mimetype}. Only JPEG, PNG, and GIF are allowed.`,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @Body() createNewsfeedDto: CreateNewsfeedDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
    },
  ) {
    if (!files.images || isEmpty(files.images)) {
      throw new BadRequestException('At least one image is required');
    }

    try {
      await this.newsfeedService.createNewsfeed(
        createNewsfeedDto,
        files.images,
      );

      return { message: 'Newsfeed created successfully' };
    } catch (error) {
      throw error;
    }
  }
}
