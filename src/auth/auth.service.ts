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

    if (!supabaseUser || !supabaseUser.session) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = supabaseUser.session.access_token;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'lax',
    });

    return;
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
