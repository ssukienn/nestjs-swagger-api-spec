import { ApiOptions } from 'nestjs-swagger-api-spec-local';
import { Hello } from './app.controller';

export const appControllerOpenApiSpec: ApiOptions = {
  apiExtraModelsOptions: () => [],
  apiFoundResponseOptions: (apiDecorator) => {
    return [
      apiDecorator({ example: 'example' }),
      apiDecorator({ example: 'example' }),
    ];
  },
  apiResponseOptions: (apiDecorator) => [
    apiDecorator({ status: 211, type: String }),
  ],
};

export const appHelloHandlerOpenApiSpec: ApiOptions = {
  apiResponseOptions: (apiDecorator) => [
    apiDecorator({ status: 222, type: Hello }),
  ],
};
