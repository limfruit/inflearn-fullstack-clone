import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AccessToeknGuard extends AuthGuard('jwt-access-token') {}