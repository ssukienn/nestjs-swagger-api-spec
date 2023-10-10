import { applyDecorators } from '@nestjs/common';
import * as nestjsSwaggerModule from '@nestjs/swagger';

export const ApiSpecification = (spec: ApiOptions) => {
    let decorators: Array<MethodDecorator | ClassDecorator | PropertyDecorator>;

    decorators = Object.keys(spec)
        .flatMap((key) => {
            const apiOptionsDecoratorProvider = spec[key as keyof ApiOptions];

            if (apiOptionsDecoratorProvider) {
                const apiDecoratorType = `A${key
                    .replace('Options', '')
                    .slice(1)}` as keyof ApiDecorators;

                const apiDecorator = nestjsSwaggerModule[apiDecoratorType];
                const descriptors = apiOptionsDecoratorProvider(apiDecorator as any);

                return descriptors;
            }
        })
        .filter(isDefined);

    return applyDecorators(...decorators);
};

const isDefined = <T>(argument: T | undefined | null): argument is T => {
    return !!argument;
};

type ExtractMethods<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
};

type NestJsSwaggerModule = typeof nestjsSwaggerModule;

type NestJsSwaggerMethods = ExtractMethods<NestJsSwaggerModule>;

type ApiDecorators = {
    [K in keyof NestJsSwaggerMethods as K extends `Api${string}`
        ? K
        : never]: NestJsSwaggerMethods[K];
};

export type ApiOptions = {
    [K in keyof ApiDecorators as `${Uncapitalize<K>}Options`]?: (
        apiDecorator: ApiDecorators[K],
    ) => Array<ReturnType<ApiDecorators[K]>>;
};
