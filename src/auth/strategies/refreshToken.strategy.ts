import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { JwtPayload, JwtPayloadWithRefreshToken } from "../types/types";
import { Request } from "express";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

    constructor(public config: ConfigService) {

        super({

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('REFRESH_TOKEN_SECRET'),
            passReqToCallback: true

        })

    }

    validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {

        const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim()

        return { ...payload, refreshToken }

    }

}