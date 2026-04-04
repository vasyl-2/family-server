import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  UseGuards,
  StreamableFile,
  Header, Inject, LoggerService,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

import { UploadPhotoService } from './upload-photo.service';
import { CreateUploadPhotoDto } from './dto/create-upload-photo.dto';
import { CreateChapterDto } from './dto/create-chapter';
import { AuthPassportGuard } from '../auth/auth-passport.guard';
import { createReadStream } from 'fs';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { diskStorageOptions } from '../disk-storage-options';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('upload-photo')
export class UploadPhotoController {
  constructor(
    private readonly uploadPhotoService: UploadPhotoService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  @Post('uploadfile')
  @UseInterceptors(FileInterceptor('photo', diskStorageOptions))
  async uploadFile(
    @Body() body: CreateUploadPhotoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
        ],
        fileIsRequired: true
      })
    ) file: Express.Multer.File
  ) {

    const { filename } = file;
    try {
      await this.uploadPhotoService.uploadPhoto(body, filename);
    } catch (e) {
      this.logger.error('uploadFile', JSON.stringify(e));
      throw e;
    }

    return {
      originalName: file.originalname,
      filename: file.filename,
    };
  }

  @Post('uploadvideo')
  @UseInterceptors(FileInterceptor('video', diskStorageOptions))
  async uploadVideo(
    @Body() body: CreateUploadPhotoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
        ],
        fileIsRequired: true
      })
    ) file: Express.Multer.File
  ) {
    const { filename } = file;
    try {
      await this.uploadPhotoService.uploadVideo(body, filename);
    } catch (e) {
      this.logger.error('uploadVideo', JSON.stringify(e));
      throw e;
    }

    return {
      originalName: file.originalname,
      filename: file.filename,
    };
  }

  @Post('uploadpdf')
  @UseInterceptors(FileInterceptor('pdf', diskStorageOptions))
  async uploadDoc(
    @Body() body: CreateUploadPhotoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
        ],
        fileIsRequired: true
      })
    ) file: Express.Multer.File
  ) {
    const { filename } = file;
    try {
      await this.uploadPhotoService.uploadDoc(body, filename);
    } catch (e) {
      console.log('upload doc', JSON.stringify(e));
      throw e;
    }

    return {
      originalName: file.originalname,
      filename: file.filename,
    };
  }

  // @UseGuards(AuthGuard)
  // @SetMetadata('roles', ['admin'])
  // @Roles(['admin'])
  @Permissions(['see_all', 'edit_user'])
  @UseGuards(AuthPassportGuard, PermissionGuard)
  @Get('chapters')
  async getChapters() {
    return await this.uploadPhotoService.getAllChapters();
  }

  @Post('createchapter')
  async createChapter(@Body() chapter: CreateChapterDto) {

    try {
      await this.uploadPhotoService.createChapter(chapter);
    } catch (e) {
      console.error('CREATE_CHAPTER', JSON.stringify(e));
    }

    let result;

    try {
      result = await this.uploadPhotoService.getAllChapters();
    } catch (e) {
      console.error('createChapter', JSON.stringify(e));
    }

    return result;
  }

  @UseGuards(AuthPassportGuard)
  @Get('photos/:chapter')
  @Header('Content-Type', 'image/png')
  async findAll(@Param('chapter') chapter: string) {
    const file = createReadStream(join(process.cwd(), 'files/father/test-1700314306421-295207653.png'));
    return new StreamableFile(file);
  }

  @UseGuards(AuthPassportGuard)
  @Get('photoslist/:chapter')
  async findAllPhotos(@Param('chapter') chapter: string) {
    return await this.uploadPhotoService.findAll(chapter);
  }

  @UseGuards(AuthPassportGuard)
  @Get('pdflist/:chapter')
  async findAllPdfs(@Param('chapter') chapter: string) {
    return await this.uploadPhotoService.findAllDocs(chapter);
  }

  @UseGuards(AuthPassportGuard)
  @Get('videolist/:chapter')
  async findAllVideos(@Param('chapter') chapter: string) {
    return await this.uploadPhotoService.findAllVideos(chapter);
  }

  @Patch('updatephoto/:id')
  updatePhoto(@Param('id') id: string, @Body() body: { photo: CreateUploadPhotoDto }) {
    return this.uploadPhotoService.updatePhoto(body.photo);
  }

  @Patch('updatevideo/:id')
  updateVideo(@Param('id') id: string, @Body() body: { video: CreateUploadPhotoDto }) {
    return this.uploadPhotoService.updateVideo(body.video);
  }

  // @TODO merge into one route photo and video

  @Patch('updatepdf/:id')
  updatePdf(@Param('id') id: string, @Body() body: { doc: any }) {
    return this.uploadPhotoService.updatePdf(body.doc);
  }
}
