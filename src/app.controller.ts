import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('test')
  async getTest() {
    console.log('RECEIVED______________')
    return { a: 'hello'};
  }
}
