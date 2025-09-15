import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';
import { Photo } from '../../photo/entities/photo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Profile, (profile) => profile.user) // 指定另一面作为第二个参数
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
}
