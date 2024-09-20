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

  async deleteEvent(id: number) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id },
      });

      if (!event) {
        return {
          message: `Event with id ${id} not found`,
        };
      }

      await this.prisma.$transaction([
        this.prisma.poster.updateMany({
          where: { event_id: id },
          data: { deleted_at: new Date() },
        }),
        this.prisma.event.update({
          where: { id },
          data: { deleted_at: new Date() },
        }),
      ]);

      return {
        message: `Event with id ${id} and its posters deleted successfully`,
      };
    } catch (error) {
      throw new Error(`Failed to delete event id ${id}: ${error.message}`);
    }
  }
}
