import {Module} from '@nestjs/common';
import {WebCategoryController} from "./web-category-controller";
import {WebCategoryService} from "./web-category.services";
import {WebCategorizer, WebCategoryFactory} from "@safekids-ai/web-category";
import {ConfigService} from "@nestjs/config";
import {LoggingService} from "../logger/logging.service";
import {AiConfig} from "../config/ai-api";
import {webTimeProviders} from "../web-time/webtime.providers";
import {webCategoryProviders} from "apps/ml-api/src/app/web-category/web-category.providers";

@Module({
  controllers: [WebCategoryController],
  providers: [
    WebCategoryService,
    {
      provide: WebCategorizer,
      useFactory: (log: LoggingService, config: ConfigService) => {
        const aiConfig = config.get<AiConfig>("aiConfig");
        if (!aiConfig || !aiConfig.api_provider || !aiConfig.api_key || !aiConfig.ai_model) {
          throw new Error(`
          Missing AI configuration values. Please check the following environment variables:
          - AI_PROVIDER (found: ${aiConfig?.api_provider || 'not set'})
          - AI_API_KEY (found: ${aiConfig?.api_key || 'not set'})
          - AI_PROVIDER_MODEL (found: ${aiConfig?.ai_model || 'not set'})
          `);
        }
        return WebCategoryFactory.create(aiConfig.api_provider, aiConfig.api_key, aiConfig.ai_model)
      },
      inject: [LoggingService, ConfigService]
    }, ...webCategoryProviders
  ],
  exports: [WebCategoryService],
})
export class WebCategoryModule {
}
