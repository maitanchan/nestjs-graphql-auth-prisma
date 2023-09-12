export type JwtPayload = {

    email: string

    userId: number

}

export type JwtPayloadWithRefreshToken = JwtPayload & {

    refreshToken: string

}