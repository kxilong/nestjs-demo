import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Profile } from './profile/entities/profile.entity';
import { Photo } from './photo/entities/photo.entity';
import { Category } from './category/entities/category.entity';
import { Question } from './question/entities/question.entity';
import { ProfileModule } from './profile/profile.module';
import { PhotoModule } from './photo/photo.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import { LogsModule } from './logs/logs.module';

const envFilePath = `.env.${process.env.NODE_ENV}`;

@Global()
@Module({
  controllers: [AppController],
  imports: [
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     transport: {
    //       targets: [
    //         process.env.NODE_ENV === 'development'
    //           ? {
    //               target: 'pino-pretty',
    //               level: 'info',
    //               options: {
    //                 colorize: true,
    //               },
    //             }
    //           : {
    //               target: 'pino-roll',
    //               level: 'info',
    //               options: {
    //                 file: join('logs', 'log.txt'),
    //                 frequency: 'daily',
    //                 mkdir: true,
    //               },
    //             },
    //       ],
    //     },
    //   },
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [User, Profile, Photo, Category, Question],
          synchronize: true,
          autoLoadEntities: true,
        }) as TypeOrmModuleOptions,
    }),
    MongooseModule.forRoot('mongodb://localhost/nest'),
    UserModule,
    ProfileModule,
    PhotoModule,
    CategoryModule,
    QuestionModule,
    LogsModule,
  ],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
