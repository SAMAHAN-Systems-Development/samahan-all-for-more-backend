import { Test, TestingModule } from '@nestjs/testing';
import { BulletinController } from './bulletin.controller';
import { BulletinService } from './bulletin.service';

describe('BulletinController', () => {
  let controller: BulletinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulletinController],
      providers: [BulletinService],
    }).compile();

    controller = module.get<BulletinController>(BulletinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
