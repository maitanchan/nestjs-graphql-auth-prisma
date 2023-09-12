import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({

  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    JwtService,
    AccessTokenStrategy,
    RefreshTokenStrategy
  ]

})
export class AuthModule { }
