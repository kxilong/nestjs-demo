import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column()
  @Exclude()
  password: string;

  // 多对多关系放在另一面
  @ManyToMany(() => Role, (role) => role.users, {
    cascade: ['insert', 'update'], // 级联操作（可选，根据需求设置）
    onDelete: 'CASCADE', // 当角色被删除时，自动删除关联记录
  })
  @JoinTable({
    name: 'user_roles',
  })
  @JoinColumn()
  roles: Role[];
}
