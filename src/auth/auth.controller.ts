import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Request,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DuplicateExceptionFilter } from 'exception_filters/email-mongo-exception.filter';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Public } from 'decorators/public-auth.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
	@Public()
    @UseFilters(DuplicateExceptionFilter)
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Get('profile')
    async profile(@Request() req) {
        console.log(req.user);
        return req.user;
    }

    @Get('google/login')
    @Public()
    @UseGuards(GoogleAuthGuard)
    async googleLogin() {}

    // /api/auth/google/callback
    @Get('google/callback')
    @Public()
    @UseGuards(GoogleAuthGuard)
    async googleCallback(@Request() req) {
        return {
            ...(await this.authService.generateTokenPair({
                email: req.user.email,
                _id: req.user._id.toString(),
            })),
            user: req.user,
        };
    }

    @Post('refresh')
    @Public()
    @UseGuards(JwtRefreshAuthGuard)
    async refresh(@Request() req) {
        return {
            access_token: await this.authService.generateAccessToken(req.user),
        };
    }
}
