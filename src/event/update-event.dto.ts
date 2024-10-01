import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    return Array.isArray(value) ? value.map(Number) : [Number(value)];
  })
  @IsNumber({}, { each: true })
  delete_poster_ids?: number[];
}
