import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from './schemas/user.schem';
import { jwtConstants } from './constant';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Auth', schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: jwtConstants.secret,
        // secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          // expiresIn: config.get<string | number>('JWT_EXPIRE'),
          expiresIn: '1h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AuthModule {}
