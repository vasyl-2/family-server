import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadPhotoService } from './upload-photo.service';
import { CreateUploadPhotoDto } from './dto/create-upload-photo.dto';
import { UpdateUploadPhotoDto } from './dto/update-upload-photo.dto';
import { CreateChapterDto } from './dto/create-chapter';
import { diskStorage } from 'multer';
import { parse } from 'path';

@Controller('upload-photo')
export class UploadPhotoController {
  constructor(private readonly uploadPhotoService: UploadPhotoService) {}

  @Post('uploadfile')
  @UseInterceptors(
    FileInterceptor('photo', {
      // dest: './files',
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cB) => {
          const fileName = parse(file.originalname).name.replace(/\s/g, 'mmm');
          const extension = parse(file.originalname).ext;
          cB(null, `${fileName}${extension}`);

        }
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { buffer } = file;

    console.log('FILE___________', file);

    // const base64Image = new Buffer(file.buffer.toString(), 'binary').toString('base64');


    // console.log('BASE_____________________', base64Image);
    return {
      // file: file.buffer.toString(),
      originalName: file.originalname,
      filename: file.filename,
    };
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

  @Get()
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
