import { Test, TestingModule } from '@nestjs/testing';
import { PhotoValidatorService } from './photo-validator.service';

describe('PhotoValidatorService', () => {
  let service: PhotoValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotoValidatorService],
    }).compile();

    service = module.get<PhotoValidatorService>(PhotoValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
