import { ApiOptions } from 'nestjs-swagger-api-spec-local';
import { Hello } from './app.controller';

export const appControllerOpenApiSpec: ApiOptions = {
  apiExtraModelsOptions: (apiDecorator) => apiDecorator(Hello),
  apiExtensionOptions: (apiDecorator) =>
    apiDecorator('x-app', { source: 'api-specification' }),
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
  apiIncludeEndpointOptions: (apiDecorator) => apiDecorator(),
  apiResponseOptions: (apiDecorator) => [
    apiDecorator({ status: 222, type: Hello }),
  ],
  apiLinkOptions: (apiDecorator) => [
    apiDecorator({ from: Hello, routeParam: 'id' }),
  ],
  apiCallbacksOptions: (apiDecorator) =>
    apiDecorator({
      name: 'helloCallback',
      callbackUrl: '{$request.body#/callbackUrl}',
      method: 'post',
      requestBody: { type: Hello },
      expectedResponse: { status: 200, description: 'accepted' },
    }),
};

export const appHelloByIdOpenApiSpec: ApiOptions = {
  apiIncludeEndpointOptions: (apiDecorator) => apiDecorator(),
  apiParamOptions: (apiDecorator) => apiDecorator({ name: 'id' }),
  apiDefaultGetterOptions: (apiDecorator) => apiDecorator(Hello, 'id'),
  apiResponseOptions: (apiDecorator) => [
    apiDecorator({ status: 200, type: Hello }),
  ],
};

export const appWebhookOpenApiSpec: ApiOptions = {
  apiIncludeEndpointOptions: (apiDecorator) => apiDecorator(),
  apiWebhookOptions: (apiDecorator) => apiDecorator('helloWebhook'),
  apiResponseOptions: (apiDecorator) => [
    apiDecorator({ status: 200, type: Hello }),
  ],
};
