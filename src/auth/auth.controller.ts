import { Controller, Post, Body, Response, Get } from '@nestjs/common';
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

  @Post('login') // Use POST method for handling login
  async login(@Body() loginDto: LoginDto, @Response() res: Res) {
    const result = await this.authService.login(loginDto, res);
    return result;
  }

  @Get('user')
  async getUser() {
    const user = await this.supabaseService.getCurrentUser();
    return user;
  }
}
