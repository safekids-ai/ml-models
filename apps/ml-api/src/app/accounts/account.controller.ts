import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import { GoogleOauthGuard } from '../auth/guard/google-oauth.guard';
import { Account } from './entities/account.entity';

@Controller()
@ApiTags('Accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @ApiOperation({ summary: 'Creates an account.' })
    @Post('v2/directory/accounts')
    create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
        return this.accountService.create(createAccountDto);
    }

    @ApiOperation({ summary: 'Updates emergency contact and phone number.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Patch('v2/directory/accounts/emergencycontact')
    saveEmergencyContact(@Request() req, @Body() updateAccountDto: UpdateAccountDto) {
        return this.accountService.saveEmergencyContact(req.user.accountId, updateAccountDto);
    }

    @ApiOperation({ summary: 'Returns emergency contact and phone number.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('v2/directory/accounts/emergencycontact')
    getEmergencyContact(@Request() req) {
        return this.accountService.getEmergencyContact(req.user.accountId);
    }

    @ApiOperation({ summary: 'Updates interception categories with upper case.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Patch('v2/directory/accounts/interception-categories')
    saveInterceptionCategories(@Request() req, @Body() updateAccountDto: UpdateAccountDto) {
        return this.accountService.saveInterceptionCategories(req.user.accountId, updateAccountDto);
    }

    @ApiOperation({ summary: 'Returns interception categories.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('v2/directory/accounts/interception-categories')
    getInterceptionCategories(@Request() req) {
        return this.accountService.getInterceptionCategories(req.user.accountId);
    }

    @ApiOperation({ summary: 'Returns on-boarding status and step.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('v2/directory/accounts/onboardingstatus')
    findOnBoardingStatus(@Request() req) {
        return this.accountService.getOnBoardingStatus(req.user.accountId);
    }

    @ApiOperation({ summary: 'Updates on-boarding status.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Patch('v2/directory/accounts/onboardingstatus')
    updateOnBoardingStatus(@Request() req, @Body() updateAccountDto: UpdateAccountDto) {
        return this.accountService.updateOnBoardingStatus(req.user.accountId, updateAccountDto);
    }

    @ApiOperation({ summary: 'Updates on-boarding step.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Patch('v2/directory/accounts/onboarding-step')
    updateOnBoardingStep(@Request() req, @Body() updateAccountDto: UpdateAccountDto) {
        return this.accountService.updateOnBoardingStep(req.user.accountId, updateAccountDto);
    }

    @ApiOperation({ summary: 'Returns account type.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('v2/directory/accounts/account-type')
    getAccountType(@Request() req) {
        return this.accountService.getAccountType(req.user.accountId);
    }
}
