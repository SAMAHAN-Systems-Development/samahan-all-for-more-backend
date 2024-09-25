import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { isEmpty } from 'class-validator';

@Injectable()
export class EventService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async createEvent(data: CreateEventDto, files: Express.Multer.File[]) {
    const {
      name,
      description,
      registration_link,
      start_time,
      end_time,
      location_id,
    } = data;

    try {
      const conflictingEvent = await this.prismaService.event.findFirst({
        where: {
          location_id: location_id,
          start_time: new Date(start_time),
          end_time: new Date(end_time),
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

        if (files && !isEmpty(files)) {
          const fileUploadPromises = files.map(async (file) => {
            const posterUrl = await this.supabaseService.uploadPosterToBucket(
              file,
            );

            return prisma.poster.create({
              data: {
                event_id: newEvent.id,
                image_url: posterUrl,
              },
            });
          });

          await Promise.all(fileUploadPromises);
        }

        return newEvent;
      });

      return event;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while creating the event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
