import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { parse } from 'path';

export const diskStorageOptions: MulterOptions = {
  limits: { fileSize: 50 * 1024 * 1024 }, // 10 MB
  storage: diskStorage({
    destination: function (req, file, cb) {
      if (req.headers['chaptername']) {
        cb(null, `${process.env.FILE_PATH}/${req.headers['chaptername']}`);
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
  })
}
