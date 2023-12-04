import { orderedParamsToApiDecorators } from "./api-specification";

describe("apiDecorators", () => {
  it("should respect default insertion order", async () => {
    const decoratorArray = orderedParamsToApiDecorators({
      apiResponseOptions: (apiDecorator) => [
        apiDecorator({
          status: 200,
          description: "1",
        }),
        apiDecorator({ status: 200, description: "2" }),
      ],
      apiOperationOptions: (apiDecorator) => [
        apiDecorator({
          title: "title",
          description: "3",
        }),
        apiDecorator({ title: "title", description: "4" }),
      ],
    });

    expect(decoratorArray).toHaveLength(4);

    const apiResponse1 = decoratorArray[0];
    expect(apiResponse1?.[0]).toEqual([{ status: 200, description: "1" }]);
    expect(apiResponse1?.[1]).toBeInstanceOf(Function);
    expect(apiResponse1?.[2]).toEqual("ApiResponse");

    const apiResponse2 = decoratorArray[1];
    expect(apiResponse2?.[0]).toEqual([{ status: 200, description: "2" }]);
    expect(apiResponse2?.[1]).toBeInstanceOf(Function);
    expect(apiResponse2?.[2]).toEqual("ApiResponse");

    const apiOperationOptions3 = decoratorArray[2];
    expect(apiOperationOptions3?.[0]).toEqual([
      {
        title: "title",
        description: "3",
      },
    ]);
    expect(apiOperationOptions3?.[1]).toBeInstanceOf(Function);
    expect(apiOperationOptions3?.[2]).toEqual("ApiOperation");

    const apiOperationOptions4 = decoratorArray[3];
    expect(apiOperationOptions4?.[0]).toEqual([
      {
        title: "title",
        description: "4",
      },
    ]);
    expect(apiOperationOptions4?.[1]).toBeInstanceOf(Function);
    expect(apiOperationOptions4?.[2]).toEqual("ApiOperation");
  });

  it("should respect ordered insertion order", async () => {
    const decoratorArray = orderedParamsToApiDecorators({
      apiResponseOptions1: (apiDecorator) => [
        apiDecorator({
          status: 200,
          description: "3",
        }),
        apiDecorator({ status: 200, description: "4" }),
      ],
      apiOperationOptions: (apiDecorator) => [
        apiDecorator({
          title: "title",
          description: "1",
        }),
        apiDecorator({ title: "title", description: "2" }),
      ],
    });

    expect(decoratorArray).toHaveLength(4);

    const apiOperations1 = decoratorArray[0];
    expect(apiOperations1?.[0]).toEqual([
      {
        title: "title",
        description: "1",
      },
    ]);
    expect(apiOperations1?.[1]).toBeInstanceOf(Function);
    expect(apiOperations1?.[2]).toEqual("ApiOperation");

    const apiOperations2 = decoratorArray[1];
    expect(apiOperations2?.[0]).toEqual([
      {
        title: "title",
        description: "2",
      },
    ]);
    expect(apiOperations2?.[1]).toBeInstanceOf(Function);
    expect(apiOperations2?.[2]).toEqual("ApiOperation");

    const apiResponse3 = decoratorArray[2];
    expect(apiResponse3?.[0]).toEqual([{ status: 200, description: "3" }]);
    expect(apiResponse3?.[1]).toBeInstanceOf(Function);
    expect(apiResponse3?.[2]).toEqual("ApiResponse");

    const apiResponse4 = decoratorArray[3];
    expect(apiResponse4?.[0]).toEqual([{ status: 200, description: "4" }]);
    expect(apiResponse4?.[1]).toBeInstanceOf(Function);
    expect(apiResponse4?.[2]).toEqual("ApiResponse");
  });

  it("should respect insertion order for explicit 0  order", async () => {
    const decoratorArray = orderedParamsToApiDecorators({
      apiResponseOptions: (apiDecorator) => [
        apiDecorator({
          status: 200,
          description: "1",
        }),
      ],
      apiResponseOptions0: (apiDecorator) => [
        apiDecorator({
          status: 200,
          description: "2",
        }),
      ],
      apiResponseOptions2: (apiDecorator) => [
        apiDecorator({
          status: 200,
          description: "3",
        }),
      ],
    });

    expect(decoratorArray).toHaveLength(3);

    const apiResponse1 = decoratorArray[0];
    expect(apiResponse1?.[0]).toEqual([
      {
        status: 200,
        description: "1",
      },
    ]);
    expect(apiResponse1?.[1]).toBeInstanceOf(Function);
    expect(apiResponse1?.[2]).toEqual("ApiResponse");

    const apiResponse2 = decoratorArray[1];
    expect(apiResponse2?.[0]).toEqual([
      {
        status: 200,
        description: "2",
      },
    ]);
    expect(apiResponse2?.[1]).toBeInstanceOf(Function);
    expect(apiResponse2?.[2]).toEqual("ApiResponse");

    const apiResponse3 = decoratorArray[2];
    expect(apiResponse3?.[0]).toEqual([
      {
        status: 200,
        description: "3",
      },
    ]);
    expect(apiResponse3?.[1]).toBeInstanceOf(Function);
    expect(apiResponse3?.[2]).toEqual("ApiResponse");
  });
});
