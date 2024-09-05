import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAllCategories() {
    return this.prisma.category.findMany();
  }

  async updateCategory(id: number, data: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data,
      });

      return updatedCategory;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with id ${id} not found`);
      } else {
        throw new Error(
          'An unexpected error occurred while updating the category',
        );
      }
    }
  }

  async deleteCategory(id: number) {
    try {
      const bulletins = await this.prisma.bulletin.findMany({
        where: { category_id: id },
      });

      if (bulletins.length > 0) {
        return {
          message: 'Category in use, cannot delete',
        };
      }

      await this.prisma.category.delete({
        where: { id: id },
      });

      return {
        message: 'Category successfully deleted',
      };
    } catch (error) {
      throw new Error(`Failed to delete category id ${id}: ${error.message}`);
    }
  }
}
