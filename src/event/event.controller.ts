import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateEventDto } from './create-event.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

@Controller('/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'poster_images' }], {
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
    @Body() createEventDto: CreateEventDto,
    @UploadedFiles() files: { poster_images?: Express.Multer.File[] },
  ) {
    createEventDto.location_id = Number(createEventDto.location_id);

    try {
      await this.eventService.createEvent(createEventDto, files.poster_images);

      return { message: 'Event created successfully' };
    } catch (error) {
      throw error;
    }
  }
}
