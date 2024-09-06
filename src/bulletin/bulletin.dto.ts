import {
  IsString,
  IsNotEmpty,
  IsInt,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsCategoryIdExistsConstraint } from './bulletin.custom.decorator';

function IsCategoryIdExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsCategoryIdExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCategoryIdExistsConstraint,
    });
  };
}

export class BulletinDTO {
  @Type(() => Number)
  @IsNotEmpty({ message: 'Category is required' })
  @IsInt({ message: 'Category ID must be an integer' })
  @IsCategoryIdExists({ message: 'Category doesnt exists' })
  category_id: number;

  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @IsString({ message: 'Author must be a string' })
  @IsNotEmpty({ message: 'Author is required' })
  author: string;
}
