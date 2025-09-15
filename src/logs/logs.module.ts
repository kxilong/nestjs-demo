import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { Console, DailyRotateFile } from 'winston/lib/winston/transports';

function createDailyRotateFileTransport() {
  return new DailyRotateFile({
    level: 'error',
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  });
}

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransPorts = new Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message }) => {
              return `${timestamp} [${level}]: ${message}`;
            }),
          ),
        });
        return {
          transports: [
            consoleTransPorts,
            ...(configService.get('LOG_ON') === 'true'
              ? [createDailyRotateFileTransport()]
              : []),
          ],
        };
      },
    }),
  ],
})
export class LogsModule {}
