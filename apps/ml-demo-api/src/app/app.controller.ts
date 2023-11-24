import {Body, Controller, Get, Post} from '@nestjs/common';

import {AppService} from './app.service';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {NLPLabel, NLPResult} from "@safekids-ai/nlp-js-types";
import {NLPRequestDto} from "./types/NLPTypes";
@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get('v1/hello')
  hello(): string {
    return "Hello";
  }

  @Post('v1/find-hate')
  @ApiOperation({summary: 'Find if the text has hateful language'})
  findHate(@Body() request: NLPRequestDto): Promise<NLPResult> {
    return this.appService.findHate(request.message);
  }

  @Post('v1/classify-text')
  @ApiOperation({summary: 'Classifies text into one of the generic labels.'})
  classifyText(@Body() request: NLPRequestDto): Promise<NLPLabel> {
    return this.appService.classifyText(request.message);
  }
}
