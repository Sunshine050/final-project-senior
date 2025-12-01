import { Request } from 'express';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    organizationId?: string;
}
export interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}
export declare const CurrentUser: (...dataOrPipes: (keyof JwtPayload | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
