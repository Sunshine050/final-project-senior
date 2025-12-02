import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../../schemas/user.schema';
import { RegisterDto, LoginDto, GoogleAuthDto, FacebookAuthDto, AuthResponseDto, ProfileResponseDto } from './dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    googleAuth(googleAuthDto: GoogleAuthDto): Promise<AuthResponseDto>;
    facebookAuth(facebookAuthDto: FacebookAuthDto): Promise<AuthResponseDto>;
    getProfile(userId: string): Promise<ProfileResponseDto>;
    private generateToken;
    private mapToUserResponse;
    private decodeGoogleToken;
    private fetchFacebookProfile;
}
