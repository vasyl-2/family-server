import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { FamilyGatewayService } from './services/family-gateway/family-gateway.service';

@Injectable()
export class AppService implements OnModuleInit {

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private familyGatewayService: FamilyGatewayService
  ) { }

  onModuleInit(): any {
    this.logger.debug('AppService created !');
  }
}
