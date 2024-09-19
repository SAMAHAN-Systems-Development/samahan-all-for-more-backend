import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { isEmpty } from 'class-validator';

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  async createEvent(data: CreateEventDto) {
    const {
      name,
      description,
      registration_link,
      start_time,
      end_time,
      location_id,
      posters,
    } = data;
    try {
      const conflictingEvent = await this.prismaService.event.findFirst({
        where: {
          location_id,
          start_time,
        },
      });

      if (conflictingEvent) {
        throw new HttpException(
          'An event is already scheduled at this location at the same time',
          HttpStatus.CONFLICT,
        );
      }

      const event = await this.prismaService.$transaction(async (prisma) => {
        const newEvent = await prisma.event.create({
          data: {
            name,
            description,
            registration_link,
            start_time: new Date(start_time),
            end_time: new Date(end_time),
            location_id,
          },
        });

        if (posters && !isEmpty(posters)) {
          const posterData = posters.map(({ image_url, description }) => ({
            event_id: newEvent.id,
            image_url,
            description,
          }));

          await prisma.poster.createMany({
            data: posterData,
          });
        }

        return newEvent;
      });

      return { message: 'Event created successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error creating event:', error);
      throw new HttpException(
        'An unexpected error occurred while creating the event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
