import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('photos')
  getHello(): string {
    console.log('RECEIVE_REQUEST___!!!!!!');
    return this.appService.getHello();
  }
}
