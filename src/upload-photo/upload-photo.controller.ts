import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UploadPhotoService } from './upload-photo.service';
import { CreateUploadPhotoDto } from './dto/create-upload-photo.dto';
import { UpdateUploadPhotoDto } from './dto/update-upload-photo.dto';

@Controller('upload-photo')
export class UploadPhotoController {
  constructor(private readonly uploadPhotoService: UploadPhotoService) {}

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
