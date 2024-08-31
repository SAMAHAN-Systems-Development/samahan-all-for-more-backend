import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

@ValidatorConstraint({ name: 'IsCategoryIdExists', async: true })
@Injectable()
export class IsCategoryIdExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async validate(category_id: number): Promise<boolean> {
    if (!this.prisma) {
      console.log('Not injected properly');
    }
    const category = await this.prisma.category.findUnique({
      where: { id: category_id },
    });
    return !!category;
  }

  defaultMessage(): string {
    return 'Category ID does not exist';
  }
}
