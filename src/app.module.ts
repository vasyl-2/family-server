import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadPhotoModule } from './upload-photo/upload-photo.module';
import { AuthModule } from './auth/auth.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gallery'; // localhost
@Module({
  imports: [
    UploadPhotoModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(mongoUri),
    AuthModule,
    // MulterModule.register({
    //   dest: process.env.FILE_PATH,
    // }),
    // MulterModule.registerAsync({
    //   useFactory: () => ({
    //     dest: './upload',
    //   }),
    //   }),
    // }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/family-client/favicon.ico'),
      serveRoot: '/favicon.ico',
    }),
    ServeStaticModule.forRoot({
      rootPath: join('N:', 'Users', 'HP', 'files'), // Using join with path segments for usual server
      // rootPath: join('/usr/src/app', 'files'), // Using join with path segments for k8s
      serveRoot: '/static-api/family-back',
      exclude: ['/api/(.*)'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/family-client'),
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          level: 'debug',
          format: winston.format.combine(),
          dirname: process.env.LOG_PATH,
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d'
        })
      ],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


