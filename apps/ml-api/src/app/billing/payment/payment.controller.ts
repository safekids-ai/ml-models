import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitPaymentResponseDto } from './dto/Init-payment-response.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoogleOauthGuard } from '../../auth/guard/google-oauth.guard';

@Controller('v2/billing')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @ApiOperation({
        summary: 'Initialise payment',
        description: 'Initialise saving payment details of account',
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully returned client secret',
        type: InitPaymentResponseDto,
    })
    @ApiBearerAuth()
    @Get('init-payment')
    @UseGuards(GoogleOauthGuard)
    async initPaymentMethod(@Request() req): Promise<InitPaymentResponseDto> {
        return await this.paymentService.createPaymentIntent(req.user.accountId);
    }

    @ApiOperation({
        summary: 'Save Payment Method',
        description: 'Save payment method input by user',
    })
    @ApiResponse({
        status: 201,
        description: 'Successfully attached payment method to account',
        type: PaymentResponseDto,
    })
    @Post('payment-method')
    @UseGuards(GoogleOauthGuard)
    @ApiBearerAuth()
    async savePaymentMethod(@Request() req, @Body() dto: PaymentResponseDto): Promise<PaymentResponseDto> {
        return await this.paymentService.savePaymentMethod(req.user.accountId, dto.paymentMethodID);
    }

    @ApiOperation({
        summary: 'Fetch Payment Method',
        description: 'Fetches payment method attached to account including last 4 digits of card',
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully fetched payment method of user',
        type: PaymentResponseDto,
    })
    @Get('payment-method')
    @UseGuards(GoogleOauthGuard)
    @ApiBearerAuth()
    async getPaymentMethod(@Request() req): Promise<PaymentResponseDto> {
        return await this.paymentService.findOne(req.user.accountId);
    }
}
