import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
    imports: [
        PassportModule.register({ session: false }),
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '60s' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
