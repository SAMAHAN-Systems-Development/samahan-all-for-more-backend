import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

class PosterDto {
  @IsUrl()
  @IsNotEmpty()
  image_url: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  registration_link: string;

  @IsISO8601()
  @IsNotEmpty()
  start_time: string;

  @IsISO8601()
  @IsNotEmpty()
  end_time: string;

  @IsInt()
  @IsNotEmpty()
  location_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosterDto)
  posters: PosterDto[];
}
