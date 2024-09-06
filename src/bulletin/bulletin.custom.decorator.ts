import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
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
    if (category_id === undefined) {
      return false;
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

@ValidatorConstraint({ name: 'IsBulletinIdValid', async: true })
@Injectable()
export class IsBulletinIdValidConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async validate(id: number, args: ValidationArguments): Promise<boolean> {
    const bulletin = await this.prisma.bulletin.findUnique({
      where: { id },
    });

    if (!bulletin) {
      args.constraints.push('not_found');
      return false;
    }

    if (bulletin.deleted_at) {
      args.constraints.push('already_deleted');
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const constraint = args.constraints[args.constraints.length - 1];

    if (constraint === 'not_found') {
      return `Bulletin with id ${args.value} does not exist.`;
    }

    if (constraint === 'already_deleted') {
      return `Bulletin with id ${args.value} has already been deleted.`;
    }

    return 'Bulletin validation failed.';
  }
}
