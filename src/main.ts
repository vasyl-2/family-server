import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('./secrets/key.pem'),
  //   cert: fs.readFileSync('./secrets/cert.pem'),
  // };
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    // ...httpsOptions
  });
  // const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api/family-back')
  await app.listen(3000);
}
bootstrap();
