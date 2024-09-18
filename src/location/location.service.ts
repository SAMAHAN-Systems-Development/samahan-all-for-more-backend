import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './create-location.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isEmpty } from 'src/utils/utils';

@Injectable()
export class LocationService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const locations = this.prismaService.location.findMany();
    return locations;
  }

  async createLocation(data: CreateLocationDto) {
    try {
      await this.prismaService.location.create({
        data,
      });

      return { message: 'Successfully created a location' };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          `Location name '${data.name}' is already taken`,
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          'Failed to create a location',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async delete(id: number) {
    const location = await this.prismaService.location.findUnique({
      where: { id },
      include: { events: true },
    });

    if (!location) {
      throw new HttpException(
        `Location with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!isEmpty(location.events)) {
      throw new HttpException(
        `Location with id ${location.id} cannot be deleted because it has existing events`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.prismaService.location.delete({
        where: { id },
      });
      return { message: 'Location deleted successfully' };
    } catch {
      throw new HttpException(
        'Error deleting location',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
