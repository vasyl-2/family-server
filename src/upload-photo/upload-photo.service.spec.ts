import { Test, TestingModule } from '@nestjs/testing';
import { UploadPhotoService } from './upload-photo.service';

describe('UploadPhotoService', () => {
  let service: UploadPhotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadPhotoService],
    }).compile();

    service = module.get<UploadPhotoService>(UploadPhotoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {

    test('', async () => {

    })
  })
});
