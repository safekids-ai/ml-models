import {
  Body,
  Controller,
  FileTypeValidator,
  Get, MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';

import {AppService} from './app.service';
import {NLPLabel, NLPResult} from "@safekids-ai/nlp-js-types";
import {NLPRequestDto} from "@safekids-ai/ml-api-types";
import {FileInterceptor} from "@nestjs/platform-express";
import {Multer} from "multer";
import {Limit} from "./guards/limit.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get('v1/hello')
  hello(): string {
    return "Hello";
  }

  @Limit(1024 * 1024)
  @Post('v1/classify-hate')
  classifyHate(@Body() request: NLPRequestDto): Promise<NLPResult> {
    return this.appService.classifyHate(request.message);
  }

  @Limit(1024 * 1024)
  @Post('v1/classify-text')
  classifyText(@Body() request: NLPRequestDto): Promise<NLPLabel> {
    return this.appService.classifyText(request.message);
  }

  @Post('v1/classify-image')
  @UseInterceptors(FileInterceptor('file'))
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
