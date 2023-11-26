import {
  Body,
  Controller,
  FileTypeValidator,
  Get, MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile, UseGuards,
  UseInterceptors
} from '@nestjs/common';

import {AppService} from './app.service';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {NLPLabel, NLPResult} from "@safekids-ai/nlp-js-types";
import {NLPRequestDto} from "@safekids-ai/ml-api-types";
import {FileInterceptor} from "@nestjs/platform-express";
import {Multer} from "multer";
import {Throttle} from "@nestjs/throttler";
import {ConfigService} from "@nestjs/config";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cv = require('@techstark/opencv-js');

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get('v1/hello')
  hello(): string {
    return "Hello";
  }

  @Post('v1/classify-hate')
  @ApiOperation({summary: 'Find if the text has hateful language'})
  classifyHate(@Body() request: NLPRequestDto): Promise<NLPResult> {
    return this.appService.classifyHate(request.message);
  }

  @Post('v1/classify-text')
  @ApiOperation({summary: 'Classifies text into one of the generic labels.'})
  classifyText(@Body() request: NLPRequestDto): Promise<NLPLabel> {
    return this.appService.classifyText(request.message);
  }

  @Post('v1/classify-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({summary: 'Classifies image into a category'})
  async classifyImage(
    @UploadedFile(new ParseFilePipe({
      validators: [
        new FileTypeValidator({fileType: '.(png|jpeg|jpg)'}),
        new MaxFileSizeValidator({maxSize: 1024 * 1024 * 4}),
      ],
    }),) file: Express.Multer.File) {
    return await this.appService.classifyImage(file.buffer);
  }
}
