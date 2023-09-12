import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterInput } from './dto/register.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async register(registerInput: RegisterInput) {

    const checkUserExist = await this.prisma.user.findFirst({ where: { email: registerInput.email } })

    if (checkUserExist) {
      throw new HttpException('Email already exist', HttpStatus.CONFLICT)
    }

    const hashedPassword = await argon.hash(registerInput.password)

    const user = await this.prisma.user.create({

      data: {
        name: registerInput.name,
        email: registerInput.email,
        hashPassword: hashedPassword,
      }

    })

    const { accessToken, refreshToken } = await this.createTokens(user.id, user.email)

    await this.updateRefreshToken(user.id, refreshToken)

    return { accessToken, refreshToken, user }

  }

  async createTokens(userId: number, email: string) {

    const accessToken = this.jwtService.sign(
      { userId, email },
      { expiresIn: '1h', secret: this.configService.get('ACCESS_TOKEN_SECRET') }
    )

    const refreshToken = this.jwtService.sign(
      { userId, email, accessToken },
      { expiresIn: '7d', secret: this.configService.get('REFRESH_TOKEN_SECRET') },
    )

    return { accessToken, refreshToken }

  }

  async updateRefreshToken(userId: number, refreshToken: string) {

    const hashedRefreshToken = await argon.hash(refreshToken)

    await this.prisma.user.update({ where: { id: userId }, data: { hashRefreshToken: hashedRefreshToken } })

  }

  async login(loginInput: LoginInput) {

    const user = await this.prisma.user.findFirst({ where: { email: loginInput.email } })

    if (!user) {
      throw new ForbiddenException('Email information is wrong')
    }

    const comparePassword = await argon.verify(user.hashPassword, loginInput.password)

    if (!comparePassword) {

      throw new ForbiddenException('Password information is wrong!')

    }

    const { accessToken, refreshToken } = await this.createTokens(user.id, user.email)

    await this.updateRefreshToken(user.id, refreshToken)

    return { accessToken, refreshToken, user }

  }

  async logout(userId: number) {

    await this.prisma.user.updateMany({

      where: {

        id: userId,
        hashRefreshToken: { not: null }

      },

      data: { hashRefreshToken: null }

    })

    return { loggedOut: true }

  }

  async getNewToken(userId: number, rt: string) {

    const user = await this.prisma.user.findUnique({ where: { id: userId } })

    if (!user) {

      throw new ForbiddenException("Access Denied")

    }

    const copmpareRefreshToken = await argon.verify(user.hashRefreshToken, rt)

    if (!copmpareRefreshToken) {

      throw new ForbiddenException("Access Denied")

    }

    const { accessToken, refreshToken } = await this.createTokens(user.id, user.email)

    await this.updateRefreshToken(user.id, refreshToken)

    return { accessToken, refreshToken, user }

  }

}
