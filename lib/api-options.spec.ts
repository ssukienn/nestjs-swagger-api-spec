jest.mock("@nestjs/swagger", () => ({
  ApiOkResponse: jest.fn(() => () => undefined),
}));

import { ApiOkResponse } from "@nestjs/swagger";
import { expectNotAssignable, expectNotType, expectType } from "tsd";
import { ApiOptions } from "./api-specification";

class Linked {}

type HasApiOptionsKey<K extends string> = K extends keyof ApiOptions
  ? true
  : false;

describe("ApiOptions", () => {
  it("should typecheck for usage of not callback branded decorator", () => {
    type ApiOkOptions = Required<ApiOptions>["apiOkResponseOptions"];

    const otherDecoratorUsed = {
      apiOkResponseOptions: (_apiDecorator: Parameters<ApiOkOptions>[0]) =>
        ApiOkResponse(),
    };

    expectNotAssignable<ReturnType<Parameters<ApiOkOptions>[0]>>(
      ApiOkResponse(),
    );
    expectNotType<ApiOptions>(otherDecoratorUsed);
  });

  it("should allow for casting to branded decorator", () => {
    const castedDecoratorUsed: ApiOptions = {
      apiOkResponseOptions: (apiDecorator) =>
        ApiOkResponse() as ReturnType<typeof apiDecorator>,
    };

    expectType<ApiOptions>(castedDecoratorUsed);
  });

  it("should include Nest 11/12 controller and handler decorator options", () => {
    expectType<HasApiOptionsKey<"apiWebhookOptions">>(true);
    expectType<HasApiOptionsKey<"apiIncludeEndpointOptions">>(true);
    expectType<HasApiOptionsKey<"apiCallbacksOptions">>(true);
    expectType<HasApiOptionsKey<"apiDefaultGetterOptions">>(true);
    expectType<HasApiOptionsKey<"apiExtensionOptions">>(true);

    const nest11Options: ApiOptions = {
      apiWebhookOptions: (apiDecorator) => apiDecorator("helloWebhook"),
      apiIncludeEndpointOptions: (apiDecorator) => apiDecorator(),
      apiCallbacksOptions: (apiDecorator) =>
        apiDecorator({
          name: "helloCallback",
          callbackUrl: "{$request.body#/callbackUrl}",
          method: "post",
          requestBody: { type: Linked },
          expectedResponse: { status: 200 },
        }),
      apiDefaultGetterOptions: (apiDecorator) => apiDecorator(Linked, "id"),
      apiExtensionOptions: (apiDecorator) =>
        apiDecorator("x-app", { source: "api-specification" }),
    };

    expectType<ApiOptions>(nest11Options);
  });

  it("should exclude DTO and property decorator options", () => {
    expectType<HasApiOptionsKey<"apiSchemaOptions">>(false);
    expectType<HasApiOptionsKey<"apiResponsePropertyOptions">>(false);
    expectType<HasApiOptionsKey<"apiPropertyOptions">>(false);
    expectType<HasApiOptionsKey<"apiPropertyOptionalOptions">>(false);
    expectType<HasApiOptionsKey<"apiHidePropertyOptions">>(false);
  });
});
