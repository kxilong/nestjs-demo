import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import fs from 'fs';

function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
}

const entitiesDir =
  process.env.NODE_ENV === 'test'
    ? [__dirname + '/**/*.entity.ts']
    : [__dirname + '/**/*.entity{.ts,.js}'];

function buildConnectionOptions() {
  const defaultConfig = getEnv(`.env`);
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);
  const config = { ...defaultConfig, ...envConfig };

  return {
    type: 'mysql',
    host: config.DB_HOST,
    port: Number(config.DB_PORT),
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    entities: entitiesDir,
    synchronize: config.TYPEORM_SYNCHRONIZE === 'true',
    autoLoadEntities: true,
  } as TypeOrmModuleOptions;
}

export const connectParams = buildConnectionOptions();

export default new DataSource({
  ...connectParams,
  migrations: ['src/migrations/*{.ts,.js}'],
  subscribers: [],
} as DataSourceOptions);
