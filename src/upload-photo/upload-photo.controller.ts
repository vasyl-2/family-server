import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile, ParseFilePipe, UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { parse } from 'path';
import { diskStorage } from 'multer';

import { UploadPhotoService } from './upload-photo.service';
import { CreateUploadPhotoDto } from './dto/create-upload-photo.dto';
import { UpdateUploadPhotoDto } from './dto/update-upload-photo.dto';
import { CreateChapterDto } from './dto/create-chapter';
import { AuthGuard } from '../auth/auth.guard';
import { AuthPassportGuard } from '../auth/auth-passport.guard';

@Controller('upload-photo')
export class UploadPhotoController {
  constructor(private readonly uploadPhotoService: UploadPhotoService) {}

  @Post('uploadfile')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        // destination: './files',
        // destination: process.env.FILE_PATH,
        destination: function (req, file, cb) {
          cb(null, process.env.FILE_PATH)
        },
        filename: (req, file: Express.Multer.File, cB) => {
          const fileName = parse(file.originalname).name.replace(/\s/g, 'mmm');
          const extension = parse(file.originalname).ext;
          cB(null, `${fileName}${extension}`);
        }
      }),
    }),
  )
  async uploadFile(
    @Body() body: CreateUploadPhotoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // PhotoValidatorService
        ],
        fileIsRequired: true
      })
    ) file: Express.Multer.File
  ) {

    try {
      console.log('PATH__________________________', process.env.NODE_ENV)
      await this.uploadPhotoService.uploadPhoto(body);
    } catch (e) {
      console.log('ERROR_____1', e);
      throw e;
    }


    return {
      originalName: file.originalname,
      filename: file.filename,
    };
  }

  // @UseGuards(AuthGuard)
  @UseGuards(AuthPassportGuard)
  @Get('chapters')
  async getChapters() {
    return this.uploadPhotoService.getAllChapters()
  }

  @Post('upload')
  async uploadPhoto(@Body() photo: CreateUploadPhotoDto) {
    const result = await this.uploadPhotoService.uploadPhoto(photo);

    return result;
  }

  @Post('createChapter')
  async createChapter(@Body() chapter: CreateChapterDto) {
    const result = await this.uploadPhotoService.createChapter(chapter);

    return result;
  }

  @Post()
  create(@Body() createUploadPhotoDto: CreateUploadPhotoDto) {
    return this.uploadPhotoService.create(createUploadPhotoDto);
  }

  @UseGuards(AuthPassportGuard)
  @Get('photos')
  findAll() {
    return this.uploadPhotoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadPhotoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadPhotoDto: UpdateUploadPhotoDto) {
    return this.uploadPhotoService.update(+id, updateUploadPhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadPhotoService.remove(+id);
  }
}
