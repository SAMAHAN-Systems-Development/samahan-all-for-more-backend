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

  async updateCategory(id: number, data: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.prisma.category.update({
        where: { id: id },
        data,
      });

      return {
        id: updatedCategory.id,
        name: updatedCategory.name,
        description: updatedCategory.description,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with id ${id} not found`);
      }
    }
  }

  // DELETE CATEGORY BY ID
  async deleteCategory(id: number) {
    try {
      // Check if the category is referenced by any bulletins
      const bulletins = await this.prisma.bulletin.findMany({
        where: { category_id: id },
      });

      if (bulletins.length > 0) {
        return {
          message: 'Category in use, cannot delete',
        };
      }

      // Proceed with soft deletion if no references found
      await this.prisma.category.update({
        where: { id: id },
        data: {
          deleted_at: new Date(),
        },
      });

      return {
        message: 'Category successfully deleted',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with id ${id} not found`);
      }
      throw error; // Re-throw the error if it's not a known code
    }
  }
}
