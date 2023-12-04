import { applyDecorators } from "@nestjs/common";
import * as nestjsSwaggerModule from "@nestjs/swagger";
import { PriorityQueue } from "./priority-queue";

type OrderedParamsDecoratorTuple = {
  tuple: [
    Parameters<ApiDecorators[keyof ApiDecorators]>,
    ApiDecorators[keyof ApiDecorators],
    keyof ApiDecorators,
  ];
  order: number;
};

export const ApiSpecification = (spec: ApiOptions<OrderSuffix>) => {
  let tupleArray = orderedParamsToApiDecorators(spec);
  return applyDecorators(
    ...tupleArray.map(([params, decorator]) =>
      (decorator as any).apply(this, params),
    ),
  );
};

export const orderedParamsToApiDecorators = (spec: ApiOptions<OrderSuffix>) => {
  let orderedParamsToDecorators: Array<OrderedParamsDecoratorTuple["tuple"]> =
    [];
  const queue = new PriorityQueue(
    (a: OrderedParamsDecoratorTuple, b: OrderedParamsDecoratorTuple) => {
      return b.order - a.order;
    },
  );

  (Object.keys(spec) as Array<keyof ApiOptions<OrderSuffix>>).forEach((key) => {
    const { specApiProperty, order } = splitSpecApiPropertyAnOrder(key);
    const apiOptionsDecoratorProvider = spec[key];

    if (apiOptionsDecoratorProvider) {
      const apiDecoratorType = `A${specApiProperty
        .replace("Options", "")
        .slice(1)}` as keyof ApiDecorators;

      checkApiDecoratorPropertyName(apiDecoratorType);

      const apiDecorator = nestjsSwaggerModule[apiDecoratorType];
      const captureParameters = identityParams;

      const capturedParameters = apiOptionsDecoratorProvider(
        captureParameters as any,
      ) as unknown as Array<Parameters<ApiDecorators[typeof apiDecoratorType]>>;

      capturedParameters.forEach((parameters) => {
        apiDecorator(parameters as any);
        queue.add({
          tuple: [parameters, apiDecorator, apiDecoratorType],
          order: preciseOrder(order),
        });
      });
    }
  });

  while (queue.size) {
    const { tuple } = queue.poll() as OrderedParamsDecoratorTuple;
    orderedParamsToDecorators.push(tuple);
  }

  if (orderedParamsToDecorators.length === 0) {
    throw new Error(
      `${ApiSpecification.name} decorator must have at least one Api decorator.`,
    );
  }
  return orderedParamsToDecorators;
};

const checkApiDecoratorPropertyName = (property: unknown) => {
  if (!nestjsSwaggerModule[property as keyof ApiDecorators]) {
    throw new Error(
      `Invalid property name: '${property}'. Correct property name has '<apiDecoratorName>' format.`,
    );
  }
};

const preciseOrder = (order: number) => {
  const hrTime = process.hrtime();
  const nanoPrecision = hrTime[0] * 1_000_000 + hrTime[1] / 1_000;
  return nanoPrecision + order * 1_000_000;
};

const identityParams = <T>(...params: T[]) => params;

const REGEX = /^([a-zA-Z]+)(\d*)$/;
const splitSpecApiPropertyAnOrder = (
  property: keyof ApiOptions<OrderSuffix>,
) => {
  const match = property.match(REGEX);
  if (!match) {
    throw new Error(
      `Invalid option name: '${property}'. Correct option name has '<apiDecoratorName>Options<orderNumber | \'\'>' format.`,
    );
  }
  return {
    specApiProperty: match[1] as keyof ApiOptions,
    order: match[2] ? parseInt(match[2], 10) : 0,
  };
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

type OrderSuffix = `${number}` | "";

export type ApiOptions<Order extends string = ""> = {
  [K in keyof ApiDecorators as `${Uncapitalize<K>}Options${Order}`]?: (
    apiDecorator: ApiDecorators[K],
  ) => Array<ReturnType<ApiDecorators[K]>>;
};
