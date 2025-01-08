import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNewsfeedImageDto {
  @IsString()
  imageUrl: string;
}

export class CreateNewsfeedDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsDate()
  publishedAt?: Date;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNewsfeedImageDto)
  images?: CreateNewsfeedImageDto[];
}
