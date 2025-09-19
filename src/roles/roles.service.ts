import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  // 根据ID列表查询角色
  async findByIds(ids: number[]): Promise<Role[]> {
    return this.roleRepository.findByIds(ids);
  }

  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }

  findByName(name: string) {
    return this.roleRepository.findOne({ where: { name } });
  }

  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) {
      throw new Error('角色不存在');
    }
    const newRole = this.roleRepository.merge(role, updateRoleDto);
    return this.roleRepository.save(newRole);
  }

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
