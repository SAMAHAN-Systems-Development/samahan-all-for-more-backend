import { PartialType } from '@nestjs/swagger';
import { CreateNewsfeedDto } from './create-newsfeed.dto';

export class UpdateNewsfeedDto extends PartialType(CreateNewsfeedDto) {}
