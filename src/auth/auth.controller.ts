import { Controller, HttpCode, HttpStatus, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async signUp(@Body() registrationDto: {username: string, password: string}) {
        const user = await this.authService.register(registrationDto);
        return user;
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Post('refresh')
    async refresh(@Body() refreshDto: {username: string, token: string, refresh_token: string}) {
        return this.authService.checkRefreshToken(refreshDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user
    }
}
