import {ApiProperty} from "@nestjs/swagger";

export class NLPRequestDto  {
  @ApiProperty({
    example: 'I hate you so much',
    required: true
  })
  message : string
}
