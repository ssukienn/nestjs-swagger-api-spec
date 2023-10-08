import { ApiOptions } from "nestjs-swagger-api-spec"

export const appControllerOpenApiSpec: ApiOptions = {
    apiResponseOptions: apiDecorator => [apiDecorator({status: 222, type: Number})]
}

export const appHelloHandlerOpenApiSpec: ApiOptions = {
    apiResponseOptions: apiDecorator => [apiDecorator({status: 211, type: Number})]
}
