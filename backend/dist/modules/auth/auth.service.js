"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const user_schema_1 = require("../../schemas/user.schema");
const enums_1 = require("../../common/enums");
const node_fetch_1 = __importDefault(require("node-fetch"));
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, phone, role, organizationId } = registerDto;
        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            role: role || enums_1.Role.USER,
            organizationId: organizationId ? new mongoose_2.Types.ObjectId(organizationId) : undefined,
        });
        await user.save();
        const token = this.generateToken(user);
        return {
            accessToken: token,
            user: this.mapToUserResponse(user),
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Please login with Google');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        user.lastLogin = new Date();
        await user.save();
        const token = this.generateToken(user);
        return {
            accessToken: token,
            user: this.mapToUserResponse(user),
        };
    }
    async googleAuth(googleAuthDto) {
        const { token, organizationId } = googleAuthDto;
        let googleUser;
        try {
            const decoded = this.decodeGoogleToken(token);
            googleUser = decoded;
        }
        catch {
            throw new common_1.BadRequestException('Invalid Google token');
        }
        let user = await this.userModel.findOne({
            $or: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
        }).exec();
        if (user) {
            if (!user.googleId) {
                user.googleId = googleUser.googleId;
            }
            user.lastLogin = new Date();
            await user.save();
        }
        else {
            user = new this.userModel({
                email: googleUser.email,
                firstName: googleUser.firstName,
                lastName: googleUser.lastName,
                avatar: googleUser.picture,
                googleId: googleUser.googleId,
                isEmailVerified: true,
                role: enums_1.Role.USER,
                organizationId: organizationId ? new mongoose_2.Types.ObjectId(organizationId) : undefined,
            });
            await user.save();
        }
        const jwtToken = this.generateToken(user);
        return {
            accessToken: jwtToken,
            user: this.mapToUserResponse(user),
        };
    }
    async facebookAuth(facebookAuthDto) {
        const { token, organizationId } = facebookAuthDto;
        const profile = await this.fetchFacebookProfile(token);
        const [firstName, ...rest] = profile.name.split(' ');
        const lastName = rest.join(' ') || firstName;
        let user = await this.userModel
            .findOne({
            $or: [{ facebookId: profile.facebookId }, { email: profile.email }],
        })
            .exec();
        if (user) {
            if (!user.facebookId) {
                user.facebookId = profile.facebookId;
            }
            user.lastLogin = new Date();
            await user.save();
        }
        else {
            user = new this.userModel({
                email: profile.email,
                firstName,
                lastName,
                avatar: profile.avatar,
                facebookId: profile.facebookId,
                isEmailVerified: profile.emailVerified,
                role: enums_1.Role.USER,
                organizationId: organizationId ? new mongoose_2.Types.ObjectId(organizationId) : undefined,
            });
            await user.save();
        }
        const jwtToken = this.generateToken(user);
        return {
            accessToken: jwtToken,
            user: this.mapToUserResponse(user),
        };
    }
    async getProfile(userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const createdAt = user.createdAt || new Date();
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
    generateToken(user) {
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
            organizationId: user.organizationId?.toString(),
        };
        return this.jwtService.sign(payload);
    }
    mapToUserResponse(user) {
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
    decodeGoogleToken(token) {
        try {
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
        }
        catch {
            throw new common_1.BadRequestException('Invalid Google token format');
        }
    }
    async fetchFacebookProfile(token) {
        try {
            const response = await (0, node_fetch_1.default)(`https://graph.facebook.com/me?fields=id,name,email,picture.width(400).height(400)&access_token=${token}`);
            if (!response.ok) {
                throw new common_1.BadRequestException('Invalid Facebook token');
            }
            const data = (await response.json());
            return {
                facebookId: data.id,
                email: data.email || `${data.id}@facebook.local`,
                name: data.name || 'Facebook User',
                avatar: data.picture?.data?.url,
                emailVerified: Boolean(data.email),
            };
        }
        catch {
            throw new common_1.BadRequestException('Invalid Facebook token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map