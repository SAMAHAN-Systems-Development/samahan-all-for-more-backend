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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateEventDto } from './create-event.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Event } from '@prisma/client';
import { UpdateEventDto } from './update-event.dto';
import { GetEventsDto } from './getEvent.dto';
import { isEmpty } from 'class-validator';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

@Controller('/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'poster_images' }, { name: 'thumbnail' }], {
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
    @UploadedFiles()
    files: {
      thumbnail: Express.Multer.File[];
      poster_images?: Express.Multer.File[];
    },
  ) {
    if (!files.thumbnail || isEmpty(files.thumbnail)) {
      throw new BadRequestException('Thumbnail is required');
    }

    if (files.thumbnail.length > 1) {
      throw new BadRequestException('Only one thumbnail is allowed');
    }

    try {
      await this.eventService.createEvent(
        createEventDto,
        files.thumbnail?.[0],
        files.poster_images,
      );

      return { message: 'Event created successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'poster_images' }, { name: 'thumbnail' }], {
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
    @UploadedFiles()
    files: {
      thumbnail: Express.Multer.File[];
      poster_images?: Express.Multer.File[];
    },
  ) {
    if (files.thumbnail && files.thumbnail.length > 1) {
      throw new BadRequestException('Only one thumbnail is allowed');
    }

    const updatedEvent = await this.eventService.updateEvent(
      id,
      updateEventDto,
      files.poster_images,
      files.thumbnail ? files.thumbnail[0] : null,
      updateEventDto.delete_poster_ids,
    );

    return {
      message: 'Event updated successfully',
      data: updatedEvent,
    };
  }

  @Get()
  async findAll(@Query() getEventsDto: GetEventsDto): Promise<Event[]> {
    return this.eventService.findAllEvents(getEventsDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    return this.eventService.findEventById(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.deleteEvent(id);
  }
}
