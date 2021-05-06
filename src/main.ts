import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig: Record<string, any> = config.get('server');
  const logger = new Logger('bootstrap');

  console.log(serverConfig);

  const port = process.env.PORT || serverConfig.port;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  logger.log(`Application is up and running in port ${port}`);
}
bootstrap();
