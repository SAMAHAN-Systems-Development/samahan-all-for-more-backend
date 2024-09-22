import {
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

@Controller('/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'poster_images' }]))
  async create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFiles() files: { poster_images?: Express.Multer.File[] },
  ) {
    createEventDto.location_id = Number(createEventDto.location_id);

    try {
      this.eventService.createEvent(createEventDto, files.poster_images);

      return { message: 'Event created successfully' };
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }
}
