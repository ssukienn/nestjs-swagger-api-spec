import { Controller, Get } from '@nestjs/common';
import { ApiSpecification } from 'nestjs-swagger-api-spec';
import { appControllerOpenApiSpec, appHelloHandlerOpenApiSpec } from './app.open-api';
import { AppService } from './app.service';

@ApiSpecification(appControllerOpenApiSpec)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiSpecification(appHelloHandlerOpenApiSpec)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
