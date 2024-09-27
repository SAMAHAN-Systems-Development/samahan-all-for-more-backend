import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EventController', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        EventService,
        PrismaService,
        JwtService,
        SupabaseService,
        PrismaService,
        JwtService,
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
