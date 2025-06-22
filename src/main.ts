import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('/etc/ssl/key.pem'), // Path to private key
  //   cert: fs.readFileSync('/etc/ssl/cert.pem'), // Path to public certificate
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
