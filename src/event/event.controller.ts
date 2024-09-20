import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from '../auth/auth.guard';
import { Event } from '@prisma/client';

@Controller('/events')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll(
    @Query() query: { page: number; limit?: number },
  ): Promise<{ data: Event[] }> {
    const { page = 1, limit = 10 } = query;
    return this.eventService.findAllEvents(Number(page), Number(limit));
  }
}
