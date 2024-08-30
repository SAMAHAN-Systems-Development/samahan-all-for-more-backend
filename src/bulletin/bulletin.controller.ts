import { Controller } from '@nestjs/common';
import { BulletinService } from './bulletin.service';

@Controller('bulletin')
export class BulletinController {
  constructor(private readonly bulletinService: BulletinService) {}
}
