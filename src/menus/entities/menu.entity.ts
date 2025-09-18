import { Role } from '../../roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column({
    type: 'int',
    default: 0,
  })
  order: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  acl: string;

  @ManyToMany(() => Role, (roles) => roles.menus)
  @JoinTable({ name: 'role_menus' })
  roles: Role;
}
