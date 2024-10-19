import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response as Res } from 'express';
import { SupabaseService } from 'supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  async login(loginDto: LoginDto, res: Res) {
    const { email, password } = loginDto;

    const supabaseUser = await this.supabaseService.signInSupabaseUser({
      email,
      password,
    });

    const accessToken = supabaseUser.session.access_token;

    const returnValue = res
      .set({
        'x-access-token': accessToken,
        'Access-Control-Expose-Headers': 'x-access-token',
      })
      .json({ email });
    return returnValue;
  }

  async getUserInfoBySupabaseUserId(
    supabaseUserId: string,
  ): Promise<{ email: string; userType: string }> {
    const user = await this.prismaService.user.findUnique({
      where: {
        supabaseUserId: supabaseUserId,
      },
      select: {
        email: true,
        userType: true,
      },
    });

    return user;
  }
}
