import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../../schemas/user.schema';
import { RegisterDto, LoginDto, GoogleAuthDto, AuthResponseDto, UserResponseDto, ProfileResponseDto } from './dto';
import { Role } from '../../common/enums';
import { JwtPayload } from '../../common/decorators/current-user.decorator';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, phone, role, organizationId } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new this.userModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: role || Role.USER,
      organizationId: organizationId ? new Types.ObjectId(organizationId) : undefined,
    });

    await user.save();

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      accessToken: token,
      user: this.mapToUserResponse(user),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('Please login with Google');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      accessToken: token,
      user: this.mapToUserResponse(user),
    };
  }

  async googleAuth(googleAuthDto: GoogleAuthDto): Promise<AuthResponseDto> {
    const { token, organizationId } = googleAuthDto;

    // In a real implementation, you would verify the Google token
    // For now, we'll decode it and extract user info
    // This is a simplified version - in production, use Google's token verification API
    
    let googleUser: { email: string; firstName: string; lastName: string; picture?: string; googleId: string };
    
    try {
      // Decode the token (this is simplified - in production, verify with Google)
      const decoded = this.decodeGoogleToken(token);
      googleUser = decoded;
    } catch {
      throw new BadRequestException('Invalid Google token');
    }

    // Find or create user
    let user = await this.userModel.findOne({
      $or: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
    }).exec();

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleUser.googleId;
      }
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = new this.userModel({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        avatar: googleUser.picture,
        googleId: googleUser.googleId,
        isEmailVerified: true,
        role: Role.USER,
        organizationId: organizationId ? new Types.ObjectId(organizationId) : undefined,
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = this.generateToken(user);

    return {
      accessToken: jwtToken,
      user: this.mapToUserResponse(user),
    };
  }

  async getProfile(userId: string): Promise<ProfileResponseDto> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Access timestamps from the document
    const createdAt = (user as unknown as { createdAt?: Date }).createdAt || new Date();

    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      organizationId: user.organizationId?.toString(),
      avatar: user.avatar,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt,
    };
  }

  private generateToken(user: UserDocument): string {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId?.toString(),
    };

    return this.jwtService.sign(payload);
  }

  private mapToUserResponse(user: UserDocument): UserResponseDto {
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      organizationId: user.organizationId?.toString(),
      avatar: user.avatar,
      isActive: user.isActive,
    };
  }

  private decodeGoogleToken(token: string): { email: string; firstName: string; lastName: string; picture?: string; googleId: string } {
    // This is a simplified implementation
    // In production, you should verify the token with Google's API
    // https://developers.google.com/identity/sign-in/web/backend-auth
    
    try {
      // Try to decode as JWT (Google ID token format)
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        return {
          email: payload.email,
          firstName: payload.given_name || payload.name?.split(' ')[0] || '',
          lastName: payload.family_name || payload.name?.split(' ')[1] || '',
          picture: payload.picture,
          googleId: payload.sub,
        };
      }
      throw new Error('Invalid token format');
    } catch {
      throw new BadRequestException('Invalid Google token format');
    }
  }
}

