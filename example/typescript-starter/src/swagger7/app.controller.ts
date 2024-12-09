import { Controller, Get } from '@nestjs/common';
import { ApiSpecification } from 'nestjs-swagger-api-spec-local';
import {
  appControllerOpenApiSpec,
  appHelloHandlerOpenApiSpec,
} from './app.open-api';
import { AppService } from './app.service';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Hello {
  @ApiProperty()
  hello: string;
}

@ApiSpecification(appControllerOpenApiSpec)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiSpecification(appHelloHandlerOpenApiSpec)
  @Get()
  getHello(): Hello {
    return this.appService.getHello();
  }
}

@Controller()
export class SomeController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Hello {
    return this.appService.getHello();
  }
}
