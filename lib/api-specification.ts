import { applyDecorators } from "@nestjs/common";
import * as nestjsSwaggerModule from "@nestjs/swagger";

type OrderedDecorator = {
  decorator: ClassDecorator | MethodDecorator;
  order: number;
};

export const ApiSpecification = (spec: ApiOptions) => {
  let decorators = orderedParamsToApiDecorators(spec);
  return applyDecorators(...decorators);
};

const orderedParamsToApiDecorators = (
  spec: ApiOptions,
): Array<ClassDecorator | MethodDecorator> => {
  const array: OrderedDecorator[] = [];

  (Object.keys(spec) as Array<keyof ApiOptions>).forEach((key) => {
    const { specApiProperty, order } = splitSpecApiPropertyAnOrder(key);
    const apiOptionsDecoratorProvider = spec[key];

    if (apiOptionsDecoratorProvider) {
      const apiDecoratorType = `A${specApiProperty
        .replace("Options", "")
        .slice(1)}` as keyof ApiDecoratorFactories;

      checkApiDecoratorPropertyName(apiDecoratorType, specApiProperty);

      const apiDecoratorFactory = nestjsSwaggerModule[apiDecoratorType];

      const apiDecorator = apiOptionsDecoratorProvider(
        apiDecoratorFactory as any,
      );

      (Array.isArray(apiDecorator) ? apiDecorator : [apiDecorator]).forEach(
        (decorator) => {
          array.push({
            decorator,
            // ensure stable sort
            order: nanoTimeOrder(order),
          });
        },
      );
    }
  });

  const sortedArray = [...array]
    .sort((a, b) => a.order - b.order)
    .map((a) => a.decorator);

  if (sortedArray.length === 0) {
    throw new Error(
      `${ApiSpecification.name} decorator must define at least one supported Api decorator.`,
    );
  }
  return sortedArray;
};

const checkApiDecoratorPropertyName = (
  decoratorName: keyof ApiDecoratorFactories,
  specProperty: string,
) => {
  if (!nestjsSwaggerModule[decoratorName]) {
    throw new Error(
      `Invalid specification option name: '${specProperty}'. There is no such decorator like: '${decoratorName}'`,
    );
  }
};

const nanoTimeOrder = (order: number) => {
  const hrTime = process.hrtime();
  const nanoPrecision = hrTime[0] * 1_000_000 + hrTime[1] / 1_000;
  return nanoPrecision + order * 1_000_000;
};

const REGEX = /^([a-zA-Z]+)Options(-?\d*)$/;
const splitSpecApiPropertyAnOrder = (property: keyof ApiOptions) => {
  const match = property.match(REGEX);
  if (!match) {
    throw new Error(
      `Invalid specification option name: '${property}'. Correct option name has '<apiDecoratorName>Options<orderNumber | \'\'>' format.`,
    );
  }
  return {
    specApiProperty: `${match[1]}Options` as keyof ApiOptions,
    order: match[2] ? parseInt(match[2], 10) : 0,
  };
};

type ExtractFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
};

type NestJsSwaggerModule = typeof nestjsSwaggerModule;

type NestJsSwaggerMethods = ExtractFunctions<NestJsSwaggerModule>;

type NestJSwaggerNotComposableMethodsKeys =
  // properties decorator are not used on controllers/handlers
  "ApiHideProperty" | "ApiProperty" | "ApiPropertyOptional";

type BrandFunction<
  Brand extends string,
  OriginalFunc extends (...args: any[]) => any,
> = (
  ...args: Parameters<OriginalFunc>
) => ReturnType<OriginalFunc> & { __returnTypeBrand: Brand };

type ApiDecoratorFactories = {
  [K in keyof NestJsSwaggerMethods as K extends `Api${string}`
    ? K extends NestJSwaggerNotComposableMethodsKeys
      ? never
      : K
    : never]: BrandFunction<K, NestJsSwaggerMethods[K]>;
};

export type ApiOptions = {
  [K in keyof ApiDecoratorFactories as `${Uncapitalize<K>}Options${
    | number
    | ""}`]?: (
    apiDecorator: ApiDecoratorFactories[K],
  ) =>
    | ReturnType<ApiDecoratorFactories[K]>
    | Array<ReturnType<ApiDecoratorFactories[K]>>;
};
