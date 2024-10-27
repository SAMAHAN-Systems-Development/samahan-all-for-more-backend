import {
  Controller,
  Post,
  Body,
  Response,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { Response as Res } from 'express';
import { SupabaseService } from 'supabase/supabase.service';

@Controller('auth') // Use '/login' as the endpoint
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Response() res: Res) {
    try {
      await this.authService.login(loginDto, res);
      return res.status(HttpStatus.OK).json({ message: 'Login successful' });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message || 'Invalid credentials' });
    }
  }

  @Get('user')
  async getUser() {
    const user = await this.supabaseService.getCurrentSession();
    return user;
  }
}
