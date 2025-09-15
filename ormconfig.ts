import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Photo } from 'src/photo/entities/photo.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';

export const config = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'test',
  entities: [User, Profile, Photo, Category, Question],
  synchronize: true,
  autoLoadEntities: true,
} as TypeOrmModuleOptions;
