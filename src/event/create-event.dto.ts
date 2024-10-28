import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';
import { IsStartTimeBeforeEndTime } from './is-start-time-before-end-time.constraint';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  registration_link: string;

  @IsISO8601()
  @IsNotEmpty()
  @IsStartTimeBeforeEndTime('end_time')
  start_time: string;

  @IsISO8601()
  @IsNotEmpty()
  end_time: string;

  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  location_id: number;
}
