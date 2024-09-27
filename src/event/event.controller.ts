import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Delete,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateEventDto } from './create-event.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Event } from '@prisma/client';
import { UpdateEventDto } from './update-event.dto';

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

  @Put(':id')
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFiles() files: { poster_images?: Express.Multer.File[] },
  ) {
    if (updateEventDto.location_id) {
      updateEventDto.location_id = Number(updateEventDto.location_id);
    }

    if (updateEventDto.delete_poster_ids) {
      updateEventDto.delete_poster_ids = updateEventDto.delete_poster_ids.map(
        (id) => Number(id),
      );
    }

    try {
      const updatedEvent = await this.eventService.updateEvent(
        id,
        updateEventDto,
        files.poster_images,
        updateEventDto.delete_poster_ids,
      );

      return { message: 'Event updated successfully', data: updatedEvent };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query() query: { page: number; limit?: number },
  ): Promise<{ data: Event[] }> {
    const { page = 1, limit = 10 } = query;
    return this.eventService.findAllEvents(Number(page), Number(limit));
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.deleteEvent(id);
  }
}
