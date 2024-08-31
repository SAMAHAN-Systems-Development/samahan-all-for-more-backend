import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    return this.prisma.category.create({
      data,
    });
  }
}
