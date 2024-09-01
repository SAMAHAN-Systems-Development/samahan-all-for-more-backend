import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './createCategory.dto';
import { UpdateCategoryDto } from './updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    await this.prisma.category.create({
      data,
    });

    return {
      messsage: 'Category successfully created',
    };
  }

  async updateCategory(id: number, data: UpdateCategoryDto) {
    await this.prisma.category.update({
      where: { id: id },
      data,
    });

    return {
      message: 'Category successfully edited',
    };
  }
}
