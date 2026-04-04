import { Test, TestingModule } from '@nestjs/testing';
import { FamilyGatewayService } from './family-gateway.service';

describe('FamilyGatewayService', () => {
  let service: FamilyGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamilyGatewayService],
    }).compile();

    service = module.get<FamilyGatewayService>(FamilyGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
