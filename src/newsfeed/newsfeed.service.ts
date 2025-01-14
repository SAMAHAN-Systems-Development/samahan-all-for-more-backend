import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateNewsfeedDto } from './create-newsfeed.dto';
import { isEmpty } from 'lodash';

@Injectable()
export class NewsfeedService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async createNewsfeed(data: CreateNewsfeedDto, files: Express.Multer.File[]) {
    const { title, content, publishedAt, isPublished } = data;

    try {
      const newsfeed = await this.prismaService.$transaction(async (prisma) => {
        const newNewsfeed = await prisma.newsfeed.create({
          data: {
            title,
            content,
            publishedAt,
            isPublished: isPublished ?? true,
          },
        });

        if (files && !isEmpty(files)) {
          const fileUploadPromises = files.map(async (file) => {
            const imageUrl = await this.supabaseService.uploadPosterToBucket(
              file,
            );

            return prisma.newsfeedImage.create({
              data: {
                newsfeedId: newNewsfeed.id,
                imageUrl,
              },
            });
          });

          await Promise.all(fileUploadPromises);
        }

        return newNewsfeed;
      });

      return newsfeed;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while creating the newsfeed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllNewsfeeds() {
    return this.prismaService.newsfeed.findMany({
      include: {
        images: true,
      },
    });
  }

  async findNewsfeedById(id: number) {
    const newsfeed = await this.prismaService.newsfeed.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
      },
    });

    if (!newsfeed) {
      throw new NotFoundException(`Newsfeed with id ${id} not found`);
    }

    return newsfeed;
  }
}
