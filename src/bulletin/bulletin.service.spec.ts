import { Test, TestingModule } from '@nestjs/testing';
import { BulletinService } from './bulletin.service';

describe('BulletinService', () => {
  let service: BulletinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BulletinService],
    }).compile();

    service = module.get<BulletinService>(BulletinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
