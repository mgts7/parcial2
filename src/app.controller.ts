import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { Response } from 'express';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHome(@Res() res: Response) {
    const filePath = join(__dirname, '..', 'public', 'index.html'); // Ruta del archivo
    return res.sendFile(filePath);
  }
}
