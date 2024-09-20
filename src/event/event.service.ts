import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async findAllEvents(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const totalEvents = await this.prisma.event.count({
      where: {
        deleted_at: null,
      },
    });

    const events = await this.prisma.event.findMany({
      skip: skip,
      take: limit,
      where: {
        deleted_at: null,
      },
      include: {
        location: true,
      },
      orderBy: {
        created_at: 'desc',
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
