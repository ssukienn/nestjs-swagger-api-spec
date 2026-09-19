import { Controller, Get, Param } from '@nestjs/common';
import { ApiSpecification } from 'nestjs-swagger-api-spec-local';
import {
  appControllerOpenApiSpec,
  appHelloByIdOpenApiSpec,
  appHelloHandlerOpenApiSpec,
  appWebhookOpenApiSpec,
} from './app.open-api';
import { AppService } from './app.service';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Hello {
  @ApiProperty()
  hello: string;

  @ApiProperty({ link: () => Hello })
  @ApiPropertyOptional()
  world?: string;

  @ApiProperty({ link: () => Hello })
  anotherWorld: string;
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

  @ApiSpecification(appWebhookOpenApiSpec)
  @Get('webhook')
  onHelloWebhook(): Hello {
    return this.appService.getHello();
  }

  @ApiSpecification(appHelloByIdOpenApiSpec)
  @Get(':id')
  getHelloById(@Param('id') _id: string): Hello {
    return this.appService.getHello();
  }
}

@Controller()
export class SomeController {
  constructor(private readonly appService: AppService) {}

  @Get('hidden')
  getHidden(): Hello {
    return this.appService.getHello();
  }
}
