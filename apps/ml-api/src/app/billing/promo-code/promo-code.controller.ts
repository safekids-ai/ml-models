import { Controller, Get, HttpException, HttpStatus, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from '../../auth/guard/google-oauth.guard';
import { PromoCodeService } from './promo-code.service';
import { LoggingService } from '../../logger/logging.service';

@ApiTags('PromotionCodes')
@Controller('v2/billing/')
export class PromoCodeController {
    constructor(private readonly promotionCodeService: PromoCodeService, private readonly logger: LoggingService) {}
    @ApiOperation({ summary: 'Returns default plans.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('promotioncodes/:code')
    async findCode(@Request() req, @Param('code') code: string) {
        return await this.promotionCodeService.findCodeDetails(code).catch((e) => {
            this.logger.error(`Failed to get promotion code. ${e}`);
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        });
    }

    @ApiOperation({ summary: 'Return promotion code link for customer.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Get('customers/promotioncodes')
    async generatePromotionCode(@Request() req) {
        const userId = req.user.userId;
        const accountId = req.user.accountId;
        return await this.promotionCodeService.getPromotionCodeLink(userId, accountId).catch((e) => {
            this.logger.error(`Failed to get promotion code link. ${e}`, e);
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        });
    }

    @ApiOperation({ summary: 'Apply promotion code.' })
    @ApiBearerAuth()
    @UseGuards(GoogleOauthGuard)
    @Patch('promotioncodes/:promotionCode/apply')
    public async applyPromotionCode(@Request() req, @Param('promotionCode') promotionCode: string): Promise<void> {
        await this.promotionCodeService.applyPromotionCode(req.user.accountId, promotionCode);
    }
}
