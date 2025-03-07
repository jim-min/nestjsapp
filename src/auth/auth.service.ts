import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import * as argon2 from 'argon2';
import { User } from 'src/users/users.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    // 회원가입
    async signUp(data: SignUpDto): Promise<any>{
        const existUser = await this.usersService.findbyUsername(data.username);
        if (existUser) {
            throw new BadRequestException(
                `${data.username}은 이미 있는데요?`
            )
        }
        // 비번 해싱
        const hashedPassword = await this.hashFn(data.password);
        const newUser = await this.usersService.create({
            ...data,
            password: hashedPassword,
        });

        // 토큰 반환
        const tokens = await this.getTokens(newUser);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
    }
    
    // 로그인
    async signIn(data: SignInDto): Promise<any>{
        const user = await this.usersService.findbyUsername(data.username);
        if (!user) {
            throw new BadRequestException(
                `${data.username}을 찾을 수 없어요`
            );
        }

        const isPasswordMatched = await argon2.verify(data.password, user.password);
        if (!isPasswordMatched) {
            throw new BadRequestException('비밀번호가 일치하지 않습니다');
        }

        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    // 로그아웃
    async signOut(userId: string): Promise<void> {
        await this.usersService.update(userId, {
            refreshToken: undefined,
        });
    }

    // 토큰 재발급
    async refreshAllTokens(userId: string, refreshToken: string){
        const user = await this.usersService.findbyId(userId);

        if (!user || !user.refreshToken) {
            throw new BadRequestException('유저를 찾을 수 없어요');
        }

        const isRefreshTokenMatched = await argon2.verify(user.refreshToken, refreshToken);
        if (!isRefreshTokenMatched) {
            throw new BadRequestException('리프레시 토큰이 일치하지 않습니다');
        }

        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        
        return tokens;
    }

    private async hashFn(data: string): Promise<string> {
        return argon2.hash(data);   
    }

    private async getTokens(user: User): Promise<{
        accessToken : string;
        refreshToken : string;
    }> {
        const [accessToken, refreshToken] = await Promise.all([
            // accessToken
            this.jwtService.signAsync({
                sub: user.id,
                username: user.username,
            }, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: '15m',
            }), 
            // refreshToken
            this.jwtService.signAsync({
                sub: user.id,
                username: user.username,
            }, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            })
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await this.hashFn(refreshToken); 
        await this.usersService.update(userId, 
            {
                refreshToken: hashedRefreshToken
            }
        )
    }
}