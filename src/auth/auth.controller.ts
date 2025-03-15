import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AccessTokenGuard } from 'src/common/guard/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guard/refresh-token.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('signup')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @Post('signin')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @UseGuards(AccessTokenGuard)
    @Get('signout')
    signOut(@Req() req: any) {
        const userId = req.user['id'];
        this.authService.signOut(userId);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshAllTokens(@Req() req: any) {
        const userId = req.user['id'];
        const refreshToken = req.user['refreshToken'];

        return this.authService.refreshAllTokens(userId, refreshToken);
    }
}
