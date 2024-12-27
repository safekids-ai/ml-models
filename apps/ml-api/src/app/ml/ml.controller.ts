import {
  Body,
  Controller,
  FileTypeValidator,
  Get, HttpException, HttpStatus, MaxFileSizeValidator,
  ParseFilePipe,
  Post, Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';

import {MlService} from './ml.service';
import {NLPLabel, NLPResult} from "@safekids-ai/nlp-js-types";
import {NLPRequestDto} from "@safekids-ai/ml-api-types";
import {FileInterceptor} from "@nestjs/platform-express";
import {Multer} from "multer";
import {Limit} from "../guards/limit.guard";
import {ApiBody, ApiTags} from "@nestjs/swagger";
import {enumToJson} from "../app.utils";

@ApiTags('App')
@Controller('v1/ml')
export class MlController {
  constructor(private readonly appService: MlService) {
  }

  @ApiBody({
    type: NLPRequestDto,
    description: 'Json structure for NLP Toxic Language Request. Max size 1MB.',
    examples: {
      'Toxic': {
        description: "See if the message has toxic language",
        value: {message: "you're a disgusting person"}
      }
    },
  })
  @Limit(1024 * 1024)
  @Post('classify-toxic')
  classifyToxic(@Body() request: NLPRequestDto): Promise<NLPResult> {
    return this.appService.classifyHate(request.message);
  }

  @ApiBody({
    type: NLPRequestDto,
    examples: {
      'Hate': {
        description: "Intent to find hate speech",
        value: {message: "you're a disgusting person"}
      },
      'Adult': {
        description: "Intent of adult content search",
        value: {message: "find adult sex links videos"}
      },
      'Proxy': {
        description: "Intent of finding proxy websites",
        value: {message: "f7 Best Proxy Websites For Schools to Access Blocked Websites"}
      },
      'Weapons': {
        description: "Intent of finding weapons",
        value: {message: "The Most Trusted Place To Buy Guns :: Guns.com"}
      },
      'Self-harm': {
        description: "Intent of hurting oneself",
        value: {message: "Cutting and Self-Harm"}
      },
    },
    description: 'Json structure for NLP Text Classification Request. Max size 1MB.',
  })
  @Limit(1024 * 1024)
  @Post('classify-text')
  classifyText(@Body() request: NLPRequestDto): Promise<NLPLabel> {
    return this.appService.classifyText(request.message);
  }

  @ApiBody({
    description: 'Classify image for adult or weapons content. Max size 4MB.',
  })
  @Post('classify-image')
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

  @ApiBody({
    description: 'Classify image for adult or weapons content',
  })
  @Get('classify-image-url')
  async classifyImageURL(@Query('url') url: string) {
    return await this.appService.classifyImageURL(url);
  }
}
