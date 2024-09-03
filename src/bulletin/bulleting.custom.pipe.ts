import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ValidateNotSoftDeletePipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: number) {
    const bulletin = await this.prisma.bulletin.findUnique({
      where: { id: value },
      select: { deleted_at: true },
    });

    if (!bulletin || bulletin.deleted_at !== null) {
      throw new NotFoundException(
        `Bulletin with ID ${value} does not exists or has been deleted`,
      );
    }

    return value;
  }
}
