import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUserDto {
  @IsString()
  @Length(1, 32, {
    message: '用户名 must be between 1 and 32 characters',
  })
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(6, 32, {
    message: '密码 must be between 6 and 32 characters',
  })
  @IsNotEmpty()
  password: string;
}
