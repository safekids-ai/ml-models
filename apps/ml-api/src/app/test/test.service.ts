import {Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {CategoryConfig} from "../config/category";

@Injectable()
export class TestService {

  constructor(private readonly configService: ConfigService) {
    if (!configService) {
      throw new Error("Config service not initialized")
    }
    console.log(configService.get<CategoryConfig>("categoryConfig"))
  }
}
