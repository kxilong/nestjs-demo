import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Role } from '../enums/role.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // 查询当前账号的角色
    const role = await this.userService.findOneByName(user.name);
    // 判断角色符合要求
    if (!role || !role.roles) {
      // 提示用户没有权限
      return false;
    }
    console.log('user roles:', role.roles, requiredRoles);
    return role.roles.some((r) => requiredRoles.includes(r.id));
  }
}
