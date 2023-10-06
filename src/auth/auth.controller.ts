import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    const access_token = await this.authService.generateAccessToken(req.user);
    const refresh_toekn = await this.authService.generateRefreshToken(req.user);

    return {
      access_token,
      refresh_toekn,
    };
  }

  @Post('refresh')
  @ApiBody({ type: RefreshDto })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }
}
