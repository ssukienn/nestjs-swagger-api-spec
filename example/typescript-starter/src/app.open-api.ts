import { ApiOptions } from 'nestjs-swagger-api-spec';

export const appControllerOpenApiSpec: ApiOptions = {
  apiExtraModelsOptions: () => [],
  apiFoundResponseOptions: (apiDecorator) => {
    return [apiDecorator({ status: 200 }), apiDecorator({ status: 200 })];
  },
  apiResponseOptions: (apiDecorator) => [
    apiDecorator({ status: 211, type: String }),
  ],
};

export const appHelloHandlerOpenApiSpec: ApiOptions = {
  apiResponseOptions: (apiDecorator) => [
    apiDecorator({ status: 222, type: Number }),
  ],
};
