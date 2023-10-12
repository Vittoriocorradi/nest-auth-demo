import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async register(registrationDto: {username: string, password: string}):Promise<any> {

        const { username, password } = registrationDto;

        const existingUser = await this.prisma.user.findUnique({
            where: {username}
        });
        if (existingUser) {
            throw new UnauthorizedException('Utente già registrato');
        }

        const user = await this.prisma.user.create({
            data: {
                username,
                password
            }
        });

        return user;
    }

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: {username}
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        };
        const payload = { sub: user.id, username: user.username }

        const crypto = require('crypto');
        const generateRefreshToken = () => {
            const refreshToken = crypto.randomBytes(32).toString('hex');
            return refreshToken;
        }

        const refreshToken = generateRefreshToken();

        await this.prisma.user.update({
            where: { id: user.id },
            data: { refresh_jwt: refreshToken }
        })


        return {
            username: user.username,
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: refreshToken,
        };
    }

    async checkRefreshToken(refreshDto: {username: string, token: string, refresh_token: string}) {
        const { username, token, refresh_token } = refreshDto;

        if (token) {
            return 'Accesso autorizzato'
        }

        const user = await this.prisma.user.findUnique({
            where: {username: username}
        })

        if (!refresh_token || user.refresh_jwt !== refresh_token) {
            throw new UnauthorizedException('Accesso non autorizzato');
        }

        const payload = { sub: user.id, username: user.username };

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
