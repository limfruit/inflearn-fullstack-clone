import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

type JwtPayload = {
    sub: string;
    email?: string;
    name?: string;
    picture?: null;
    iat?: number;
  };

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-access-token',
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 'Authorization': 'Bearer {accessToken}' 에서 알아서 token을 추출해올 수 있는,,
            ignoreExpiration: false, // 토큰이 만료된 것을 무시할지 여부
            secretOrKey: process.env.AUTH_SECRET!,
        });
    }

    async validate(payload: JwtPayload) {
        return payload;
    }
}