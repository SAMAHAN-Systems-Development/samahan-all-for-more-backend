import { Body, Controller, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './createCategory.dto';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }
}
