import { Module } from '@nestjs/common';
import { RestService } from './rest.service';

@Module({
  providers: [RestService],
  exports: [RestService],
})
export class RestModule {}
