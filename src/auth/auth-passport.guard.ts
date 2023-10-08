import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthPassportGuard extends AuthGuard('jwt') {

}
