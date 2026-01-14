import {
  Controller,
  Post,
  HttpCode,
  Body,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { AuthDto } from './application/dto/auth.dto';
import { AuthApplication } from './application/auth.service';
import { AuthMapper } from './application/mappers/auth.mapper';
import { RefreshTokenDto } from './application/dto/refresh.dto';
import { Auth } from 'src/common/decorators/auth';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiLogin,
  ApiLogout,
  ApiLogoutAll,
  ApiRefresh,
} from 'src/common/swagger/auth.decorators';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authApplication: AuthApplication) {}

  @Post()
  @HttpCode(201)
  @ApiLogin()
  async login(@Body() dto: AuthDto) {
    const { user, accessToken, refreshToken } =
      await this.authApplication.login(dto);
    return new BaseResponseDto(
      AuthMapper.toResponse(user, accessToken, refreshToken),
    );
  }

  @Auth()
  @Post('logout')
  @HttpCode(200)
  @ApiLogout()
  async logout(@Req() req) {
    const userId = req.user.id;
    return new BaseResponseDto(this.authApplication.logout(userId));
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiRefresh()
  async refresh(@Body() dto: RefreshTokenDto) {
    const tokens = await this.authApplication.refresh(dto.refreshToken);
    return new BaseResponseDto(tokens);
  }

  @Auth()
  @Post('logout-all')
  @HttpCode(200)
  @ApiLogoutAll()
  async logoutAll(@Req() req) {
    const userId = req.user.id;
    return new BaseResponseDto(this.authApplication.logoutAllDevices(userId));
  }

  @Get('telegram')
  async handleTelegramAuth(@Query() query: any) {
    console.log('🔥 TELEGRAM AUTH REQUEST:');
    console.log('Full query:', JSON.stringify(query, null, 2));

    // Проверяем, что это действительно запрос от Telegram
    if (!query.id || !query.hash) {
      console.log('⚠️ Not a Telegram request');
      return { error: 'Invalid request' };
    }

    console.log('✅ Telegram user authenticated:');
    console.log(`  ID: ${query.id}`);
    console.log(`  Name: ${query.first_name} ${query.last_name || ''}`);
    console.log(`  Username: @${query.username || 'none'}`);
    console.log(
      `  Auth date: ${new Date(query.auth_date * 1000).toISOString()}`,
    );

    // Здесь будет ваша логика:
    // 1. Проверка hash (обязательно!)
    // 2. Поиск/создание пользователя в вашей БД
    // 3. Генерация JWT токенов для вашей системы

    return {
      ok: true,
      message: 'Telegram auth received',
      telegramId: query.id,
      // Возвращайте ваши JWT токены, когда настроите логику
      // accessToken: 'your_jwt_token',
      // refreshToken: 'your_refresh_token'
    };
  }
}
