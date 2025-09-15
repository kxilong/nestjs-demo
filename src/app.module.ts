import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { connectParams } from '../ormconfig';

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
    TypeOrmModule.forRoot(connectParams),
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
