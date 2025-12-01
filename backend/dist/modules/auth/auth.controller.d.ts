import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, GoogleAuthDto, AuthResponseDto, ProfileResponseDto } from './dto';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    googleAuth(googleAuthDto: GoogleAuthDto): Promise<AuthResponseDto>;
    getProfile(user: JwtPayload): Promise<ProfileResponseDto>;
}
