import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { getUserDto } from '../user/dto/query-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
  ) {}

  async signIn(name: string, password: string) {
    const user = await this.userService.findOneByName(name);
    const validPassword = await argon2.verify(user?.password || '', password);
    if (!validPassword) {
      throw new ForbiddenException('用户名或者密码错误');
    }
    if (user && validPassword) {
      return this.jwtService.sign({ name, password });
    }

    throw new UnauthorizedException('没有权限');
  }

  async signUp(name: string, password: string, roleIds: number[]) {
    const hashedPassword = await argon2.hash(password);
    const roles = await this.rolesService.findByIds(roleIds);
    if (roles.length === 0) {
      throw new Error('角色不存在');
    }
    return this.userService.create({
      name,
      password: hashedPassword,
      roles,
    } as getUserDto);
  }
}
