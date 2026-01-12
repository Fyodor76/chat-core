import { Controller, Post, HttpCode, Body, Req } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthApplication } from './application/auth.service';
import { AuthMapper } from './application/mappers/auth.mapper';
import { RefreshTokenDto } from './dto/refresh.dto';
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
}
