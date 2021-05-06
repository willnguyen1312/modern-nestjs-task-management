import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig: Record<string, any> = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.HOSTNAME || dbConfig.host,
  port: process.env.PORT || dbConfig.port,
  username: process.env.USERNAME || dbConfig.username,
  password: process.env.PASSWORD || dbConfig.password,
  database: process.env.DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
};
