import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async findAllEvents(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const totalEvents = await this.prisma.event.count();

    const events = await this.prisma.event.findMany({
      skip: skip,
      take: limit,
      include: {
        location: true,
      },
    });

    return {
      data: events,
      totalEvents,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
    };
  }
}
