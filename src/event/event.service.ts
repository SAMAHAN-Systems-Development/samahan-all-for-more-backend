import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async findAllEvents(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const currentDate = new Date();

    const totalEvents = await this.prisma.event.count({
      where: {
        deleted_at: null,
        start_time: {
          gte: currentDate,
        },
      },
    });

    const events = await this.prisma.event.findMany({
      skip: skip,
      take: limit,
      where: {
        deleted_at: null,
        start_time: {
          gte: currentDate,
        },
      },
      include: {
        location: true,
      },
      orderBy: {
        start_time: 'asc',
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
