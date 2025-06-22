import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UserSchema } from './schemas/user.schem';
import { Role, RoleSchema } from './schemas/role.schema';

import { jwtConstants } from './constant';
import { JwtStrategy } from './jwt.strategy';
import { UserController } from './user.controller';
import { RoleController } from './role.controller';
import { PermissionsController } from './permissions.controller';
import { UserService } from './user.service';
import { RoleService } from './role.service';
import { PermissionsService } from './permissions.service';
import { Permissions, PermissionsSchema } from './schemas/permissions.scheme';
import { PermissionGuard } from './guards/permission.guard';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Auth', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: Permissions.name, schema: PermissionsSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: jwtConstants.secret,
        // secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          // expiresIn: config.get<string | number>('JWT_EXPIRE'),
          expiresIn: '12h',
        },
      }),
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    RoleController,
    PermissionsController,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    RoleService,
    PermissionsService,
    PermissionGuard
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
  exports: [PermissionsService, RoleService]
})
export class AuthModule {}
