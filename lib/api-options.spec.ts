import { ApiOkResponse } from "@nestjs/swagger";
import { expectNotAssignable, expectNotType, expectType } from "tsd";
import { ApiOptions } from "./api-specification";

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
});
