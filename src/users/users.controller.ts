import { Body, Controller, Delete, Get, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/common/guard/access-token.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) {}

    @UseGuards(AccessTokenGuard)
    @Get('me')
    async getMe(@Req() req: any){
        const userId = req.user['sub'];
        const user = await this.usersService.findbyId(userId);

        return { ...user, password: undefined, refreshToken: undefined }
    }

    @UseGuards(AccessTokenGuard)
    @Put('me')
    async updateUser(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.usersService.update(req.user['sub'], updateUserDto);

        return { ...user, password: undefined, refreshToken: undefined }
    }

    @UseGuards(AccessTokenGuard)
    @Delete('me')
    async deleteUser(@Req() req: any) {
        await this.usersService.remove(req.user['sub']);
    }
}

