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
import { Profile } from '../../profile/entities/profile.entity';
import { Photo } from '../../photo/entities/photo.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  @Exclude()
  isActive: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true, // 级联更新关联的profile
    // onUpdate: 'CASCADE', // 数据库级联更新
  }) // 指定另一面作为第二个参数
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Photo, (photo) => photo.user, { cascade: true })
  @JoinColumn()
  photos: Photo[];

  // 多对多关系放在另一面
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];
}
