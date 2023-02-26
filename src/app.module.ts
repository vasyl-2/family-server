import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadPhotoModule } from './upload-photo/upload-photo.module';

@Module({
  imports: [UploadPhotoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
