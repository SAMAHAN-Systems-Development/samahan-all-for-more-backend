import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateEventDto } from './createEvent.dto';

@Controller('/events')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }
}
