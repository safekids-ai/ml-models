import { Body, Controller, Get, Param, Patch, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import type { UserAttributes, UserCreationAttributes } from './entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { IsAdminOrDistrictGuard } from '../auth/guard/is-admin-or-district-guard';
import { IsAdminGuard } from '../auth/guard/is-admin-guard';

@ApiTags('User')
@Controller('v2/directory/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Creates user.' })
    @Post()
    async create(@Body() createUserDto: UserCreationAttributes) {
        await this.userService.create(createUserDto);
    }

    @ApiOperation({ summary: 'Creates user in bulk.' })
    @Post('/bulk')
    createBulk(@Body() createUserDto: UserCreationAttributes[]) {
        return this.userService.bulkCreate(createUserDto);
    }

    @ApiOperation({ summary: 'Returns user by user id.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('/profile')
    findProfile(@Request() req) {
        return this.userService.findOneById(req.user.userId);
    }

    @ApiOperation({ summary: 'Update user role to teacher.' })
    @ApiBearerAuth()
    @UseGuards(IsAdminGuard)
    @Patch('/makeTeacher')
    async makeTeacher(@Query('email') email: string, @Request() req) {
        await this.userService.makeTeacher(email, req.user.userId, req.user.accountId);
    }

    @ApiOperation({ summary: 'Update user by id.' })
    @Patch(':id')
    partailUpdate(@Param('id') id: string, @Body() updateUserDto: Partial<UserAttributes>) {
        return this.userService.patch(id, updateUserDto);
    }

    @ApiOperation({ summary: 'Update user by id.' })
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: Partial<UserAttributes>) {
        return this.userService.update(id, updateUserDto);
    }

    @ApiOperation({ summary: 'Update user role to admin.' })
    @Patch(':id/makeAdmin')
    makeAdmin(@Param('id') id: string, @Body() updateUserDto: Partial<UserAttributes>) {
        return this.userService.makeAdmin(id, updateUserDto);
    }

    @ApiOperation({ summary: 'Update user status by id.' })
    @Patch(':id/status')
    status(@Param('id') id: string, @Body() updateUserDto: Partial<UserAttributes>) {
        return this.userService.updateStatus(id, updateUserDto);
    }

    @ApiOperation({ summary: 'Update user access by id.' })
    @UseGuards(IsAdminOrDistrictGuard)
    @Patch(':id/access')
    async limitAccess(@Param('id') id: string, @Query('limit') limitAccess: boolean) {
        await this.userService.limitAccess(id, limitAccess);
    }
}
