import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './create-location.dto';
import { UpdateLocationDto } from './update-location.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const locations = this.prismaService.location.findMany({
      where: {
        deleted_at: null,
      },
    });
    return locations;
  }
}
