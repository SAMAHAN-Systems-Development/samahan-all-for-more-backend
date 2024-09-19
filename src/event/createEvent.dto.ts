import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

class PosterDto {
  @IsUrl()
  image_url: string;

  @IsString()
  description: string;
}

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUrl()
  registration_link: string;

  @IsISO8601()
  start_time: string;

  @IsISO8601()
  end_time: string;

  @IsInt()
  location_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosterDto)
  posters: PosterDto[];
}
