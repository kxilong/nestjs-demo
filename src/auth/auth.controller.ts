import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUserDto } from './dto/sign-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { SerializeInterceptor } from '../interceptors/serialize/serialize.interceptor';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

class UserDto {
  @IsString()
  id: number;
  @IsString()
  name: string;
}

class ResultDto {
  @Expose()
  name: string;
}

@Controller('auth')
// @UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signIn')
  async signIn(@Body(new ValidationPipe()) body: SignUserDto) {
    const { name, password } = body;
    const access_token = await this.authService.signIn(name, password);
    return { code: 200, msg: '登录成功', access_token };
  }

  @Post('/signUp')
  @UseGuards(AuthGuard('jwt'))
  signUp(@Body(new ValidationPipe()) body: SignUserDto, @Req() req) {
    const { name, password } = body;
    return this.authService.signUp(name, password);
  }

  @Post('/updateInfo')
  @UseInterceptors(new SerializeInterceptor(ResultDto))
  updateUserInfo(@Body() dto: UserDto) {
    return dto;
  }
}
