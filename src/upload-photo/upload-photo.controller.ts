import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile, ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { parse } from 'path';
import { diskStorage } from 'multer';

import { UploadPhotoService } from './upload-photo.service';
import { CreateUploadPhotoDto } from './dto/create-upload-photo.dto';
import { UpdateUploadPhotoDto } from './dto/update-upload-photo.dto';
import { CreateChapterDto } from './dto/create-chapter';
import { PhotoValidatorService } from './photo-validator/photo-validator.service';

@Controller('upload-photo')
export class UploadPhotoController {
  constructor(private readonly uploadPhotoService: UploadPhotoService) {}

  @Post('uploadfile')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file: Express.Multer.File, cB) => {
          const fileName = parse(file.originalname).name.replace(/\s/g, 'mmm');
          const extension = parse(file.originalname).ext;
          cB(null, `${fileName}${extension}`);
        }
      }),
    }),
  )
  async uploadFile(
    @Body() body: { [key: string]: string },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // PhotoValidatorService
        ],
        fileIsRequired: true
      })
    ) file: Express.Multer.File
  ) {
    console.log('FILE___________', file);
    console.log('BODY________________', body);

    return {
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
