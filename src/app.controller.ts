import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {

  @Get('test')
  async getTest() {
    return { a: 'hello'};
  }
  // @Get('*')
  // serveApp(@Res() res: Response) {
  //   res.sendFile(join(__dirname, '..', 'public/family-client', 'index.html'));
  // }

}
