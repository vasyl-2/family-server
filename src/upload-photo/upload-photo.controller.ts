import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile, ParseFilePipe, UseGuards, StreamableFile, Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { parse } from 'path';
import { diskStorage } from 'multer';
import { join } from 'path';

import { UploadPhotoService } from './upload-photo.service';
import { CreateUploadPhotoDto } from './dto/create-upload-photo.dto';
import { UpdateUploadPhotoDto } from './dto/update-upload-photo.dto';
import { CreateChapterDto } from './dto/create-chapter';
import { AuthPassportGuard } from '../auth/auth-passport.guard';
import { createReadStream } from 'fs';
import { CreateVideoDto } from './dto/create-video.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionGuard } from '../auth/guards/permission.guard';

@Controller('upload-photo')
export class UploadPhotoController {
  constructor(private readonly uploadPhotoService: UploadPhotoService) {}

  @Post('uploadfile')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          if (req.headers.chaptername) {
            cb(null, `${process.env.FILE_PATH}/${req.headers.chaptername}`);
          } else {
            cb(null, process.env.FILE_PATH);
          }
        },
        filename: (req, file: Express.Multer.File, cB) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          let fileName = parse(file.originalname).name.replace(/\s/g, 'mmm');
          fileName = Buffer.from(fileName, 'latin1').toString('utf8');
          fileName = `${fileName}-${uniqueSuffix}`;

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

    console.log('FILE________******', file);
    const { filename } = file;
    console.log('FILENAME_______', filename)
    try {
      await this.uploadPhotoService.uploadPhoto(body, filename);
    } catch (e) {
      console.log('ERROR_____1', e);
      throw e;
    }


    return {
      originalName: file.originalname,
      filename: file.filename,
    };
  }

  @Post('uploadvideo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          if (req.headers.chaptername) {
            console.log('CHAPTER_NAME______________________________________', req.headers.chaptername)
            cb(null, `${process.env.VIDEOS_PATH}/${req.headers.chaptername}`);
          } else {
            cb(null, `${process.env.VIDEOS_PATH}`);
          }
        },
        filename: (req, file: Express.Multer.File, cB) => {
          const _this = this;
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          let fileName = parse(file.originalname).name.replace(/\s/g, 'mmm');
          fileName = `${fileName}-${uniqueSuffix}`;

          const extension = parse(file.originalname).ext;

          cB(null, `${fileName}${extension}`);
        }
      })
    })
  )
  async uploadVideo(
    @Body() body: CreateVideoDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true
      })
    ) file: Express.Multer.File
  ) {


    console.log('FILE________******', file);
    const { filename } = file;
    try {
      await this.uploadPhotoService.uploadVideo(body, filename);
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
  // @SetMetadata('roles', ['admin'])
  // @Roles(['admin'])
  @Permissions(['see_all', 'edit_user'])
  @UseGuards(AuthPassportGuard, PermissionGuard)
  @Get('chapters')
  async getChapters() {
    const resp = await this.uploadPhotoService.getAllChapters();
    console.log('CHAPTERS__________!!!', resp[0]);
    return resp;
  }

  // @UseGuards(AuthGuard)
  @Permissions(['see_all', 'edit_user'])
  @UseGuards(AuthPassportGuard, PermissionGuard)
  @Get('video-chapters')
  async getVideoChapters() {
    return this.uploadPhotoService.getAllVideoChapters()
  }

  // @Post('upload')
  // async uploadPhoto(@Body() photo: CreateUploadPhotoDto) {
  //   const result = await this.uploadPhotoService.uploadPhoto(photo);
  //
  //   return result;
  // }

  @Post('createchapter')
  async createChapter(@Body() chapter: CreateChapterDto) {
    const resultCreated = await this.uploadPhotoService.createChapter(chapter);
    const result = await this.uploadPhotoService.getAllChapters();
    return result;
  }

  @Post('createvideochapter')
  async createVideoChapter(@Body() chapter: CreateChapterDto) {
    const resultCreated = await this.uploadPhotoService.createVideoChapter(chapter);
    const result = await this.uploadPhotoService.getAllVideoChapters();
    return result;
  }

  //

  @Post()
  create(@Body() createUploadPhotoDto: CreateUploadPhotoDto) {
    return this.uploadPhotoService.create(createUploadPhotoDto);
  }

  @UseGuards(AuthPassportGuard)
  @Get('photos/:chapter')
  @Header('Content-Type', 'image/png')
  // async findAll(@Param('chapter') chapter: string): Promise<Gallery[]> {
  async findAll(@Param('chapter') chapter: string) {
    // const photos = await this.uploadPhotoService.findAll(chapter);
    const photos = await this.uploadPhotoService.findPhotosFiles(chapter);

    console.log('CHAPTER_____________________________________', photos[0]);

    const file = createReadStream(join(process.cwd(), 'files/father/test-1700314306421-295207653.png'));
    return new StreamableFile(file);
    // return photos[0];
  }

  @UseGuards(AuthPassportGuard)
  @Get('photoslist/:chapter')
  async findAllPhotos(@Param('chapter') chapter: string) {
    const photos = await this.uploadPhotoService.findAll(chapter);
    console.log('LIST___PHOTOS______________', photos)
    return photos;
  }

  @UseGuards(AuthPassportGuard)
  @Get('videolist/:chapter')
  async findAllVideos(@Param('chapter') chapter: string) {
    const videos = await this.uploadPhotoService.findAllVideos(chapter);
    console.log('LIST___VIDEOS______________', videos);
    return videos;
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

  @Patch('updatephoto/:id')
  updatePhoto(@Param('id') id: string, @Body() body: { photo: any }) {
    console.log('ID___TO__RENAME__________', id);
    console.log('BODY____TO___RENAME_____', body);
    return this.uploadPhotoService.updatePhoto(body.photo);
  }

}
