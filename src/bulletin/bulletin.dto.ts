import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class AddBulletinDTO {
  @Type(() => Number)
  @IsInt({ message: 'Category ID must be an integer' })
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
