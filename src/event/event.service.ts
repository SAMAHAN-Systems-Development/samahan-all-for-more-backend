import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { isEmpty } from 'class-validator';
import { UpdateEventDto } from './update-event.dto';

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

  async updateEvent(
    id: number,
    data: UpdateEventDto,
    files: Express.Multer.File[],
    delete_poster_ids?: number[],
  ) {
    try {
      const event = await this.prismaService.event.findUnique({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!event) {
        throw new HttpException(
          `Event with id ${id} not found or has been deleted`,
          HttpStatus.NOT_FOUND,
        );
      }

      const {
        name,
        description,
        registration_link,
        start_time,
        end_time,
        location_id,
      } = data;

      const conflictingEvent = await this.prismaService.event.findFirst({
        where: {
          location_id,
          start_time: new Date(start_time),
          end_time: new Date(end_time),
        },
      });

      if (conflictingEvent && conflictingEvent.id !== id) {
        throw new HttpException(
          'An event is already scheduled at this location at the same time',
          HttpStatus.CONFLICT,
        );
      }

      const updatedEvent = await this.prismaService.$transaction(
        async (prisma) => {
          const updated = await prisma.event.update({
            where: { id },
            data: {
              name,
              description,
              registration_link,
              start_time: new Date(start_time),
              end_time: new Date(end_time),
              location_id,
            },
          });

          if (delete_poster_ids && !isEmpty(delete_poster_ids)) {
            const existingPosters = await this.prismaService.poster.findMany({
              where: {
                id: { in: delete_poster_ids },
                deleted_at: null,
                event_id: id,
              },
            });

            if (existingPosters.length !== delete_poster_ids.length) {
              throw new HttpException(
                'Some poster IDs are invalid or do not belong to this event',
                HttpStatus.BAD_REQUEST,
              );
            }

            await this.prismaService.poster.updateMany({
              where: { id: { in: delete_poster_ids } },
              data: { deleted_at: new Date() },
            });
          }

          if (files && !isEmpty(files)) {
            const fileUploadPromises = files.map(async (file) => {
              const posterUrl = await this.supabaseService.uploadPosterToBucket(
                file,
              );
              return prisma.poster.create({
                data: {
                  event_id: updated.id,
                  image_url: posterUrl,
                },
              });
            });

            await Promise.all(fileUploadPromises);
          }

          const updatedPosters = await prisma.poster.findMany({
            where: { event_id: updated.id, deleted_at: null },
          });

          return { updatedEvent: updated, updatedPosters };
        },
      );

      return updatedEvent;
    } catch (error) {
      throw new HttpException(
        'An unexpected error occurred while updating the event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllEvents(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const currentDate = new Date();

    const totalEvents = await this.prismaService.event.count({
      where: {
        deleted_at: null,
        start_time: {
          gte: currentDate,
        },
      },
    });

    const events = await this.prismaService.event.findMany({
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
      const event = await this.prismaService.event.findUnique({
        where: { id },
      });

      if (!event) {
        return {
          message: `Event with id ${id} not found`,
        };
      }

      if (event.deleted_at) {
        return {
          message: `Event with id ${id} has already been deleted`,
        };
      }

      await this.prismaService.$transaction([
        this.prismaService.poster.updateMany({
          where: { event_id: id },
          data: { deleted_at: new Date() },
        }),
        this.prismaService.event.update({
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
