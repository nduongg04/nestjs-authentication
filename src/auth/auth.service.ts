import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Profile } from 'passport-google-oauth20';
import { UsersService } from 'src/users/users.service';
import { removePasswordField } from 'utils';
import { CreateUserDto } from './../users/dto/create-user-dto';
import { UserJwtDto, UserWithoutPassword } from 'src/users/schema';
import { UserWithId } from 'src/users/schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            throw new UnauthorizedException('Invalid password');
        }
        return removePasswordField(user.toObject());
    }

    async generateTokenPair(user: UserJwtDto) {
        return {
            access_token: await this.generateAccessToken(user),
            refresh_token: await this.generateRefreshToken(user),
        };
    }

    async login(userInfo: UserWithoutPassword) {
        return {
            ...(await this.generateTokenPair(userInfo)),
            user: userInfo,
        };
    }

    async register(createUserDto: CreateUserDto) {
        const existingUser = await this.usersService.findOneByEmail(
            createUserDto.email,
        );
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }
        const createdUser = await this.usersService.create(createUserDto);
        return {
            ...(await this.generateTokenPair(createdUser)),
            user: removePasswordField(createdUser.toObject()),
        };
    }

    async validateGoogleUser(profile: Profile) {
        const user = await this.usersService.findOneByEmail(
            profile.emails[0].value,
        );
        if (user) {
            return removePasswordField(user.toObject());
        }
        console.log('Creating user');
        const createdUser = await this.usersService.create({
            email: profile.emails[0].value,
            displayName: profile.displayName,
            password: '',
            avatar: profile.photos[0].value,
        });
        return removePasswordField(createdUser.toObject());
    }

    async generateAccessToken(user: UserJwtDto) {
        const payload = { email: user.email, sub: user._id.toString() };
        return await this.jwtService.signAsync(payload, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        });
    }

    async generateRefreshToken(user: UserJwtDto) {
        const payload = { email: user.email, sub: user._id.toString() };
        return await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        });
    }
}
