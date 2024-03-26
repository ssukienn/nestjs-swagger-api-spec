const mockApiDecorator = jest.fn((...args) => args);

// Bind arguments starting after however many are passed in.
const bindTrailArgs = (fn: Function, ...bound_args: any[]) => {
  return (...args: any[]) => {
    return fn(...args, ...bound_args);
  };
};

import {
  ApiExtraModels,
  ApiOperation,
  ApiQueryOptions,
  ApiResponse,
} from "@nestjs/swagger";
import { ApiOptions, ApiSpecification } from "./api-specification";

// Mock specific decorator factory to return their params instead of decorator itself
jest.mock("@nestjs/swagger", () => ({
  ApiExtraModels: bindTrailArgs(mockApiDecorator, "ApiExtraModels"),
  ApiResponse: bindTrailArgs(mockApiDecorator, "ApiResponse"),
  ApiOperation: bindTrailArgs(mockApiDecorator, "ApiOperation"),
  ApiProperty: jest.fn(),
  ApiHideProperty: jest.fn(),
  ApiPropertyOptional: jest.fn(),
}));

// Mock applyDecorators to return the passed params as array instead of combining them into one
jest.mock("@nestjs/common", () => ({
  applyDecorators: jest.fn((...decorators) => decorators),
}));

describe("ApiSpecification", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("decorator factory execution", () => {
    it("should execute decorator factories in insertion order", async () => {
      ApiSpecification({
        apiResponseOptions1: (apiDecorator) => [
          apiDecorator({
            status: 200,
            description: "1",
          }),
          apiDecorator({ status: 200, description: "2" }),
        ],
        apiOperationOptions: (apiDecorator) => [
          apiDecorator({
            summary: "title",
            description: "3",
          }),
          apiDecorator({ summary: "title", description: "4" }),
        ],
      });

      const decoratorMockCalls = mockApiDecorator.mock.calls as Parameters<
        typeof ApiResponse | typeof ApiOperation | typeof ApiExtraModels
      >[];

      expect(decoratorMockCalls).toHaveLength(4);

      const apiOperations1 = decoratorMockCalls[0];
      expect(apiOperations1?.[0]).toEqual({
        status: 200,
        description: "1",
      });
      expect(apiOperations1?.[1]).toEqual("ApiResponse");

      const apiOperations2 = decoratorMockCalls[1];
      expect(apiOperations2?.[0]).toEqual({
        status: 200,
        description: "2",
      });
      expect(apiOperations2?.[1]).toEqual("ApiResponse");

      const apiResponse3 = decoratorMockCalls[2];
      expect(apiResponse3?.[0]).toEqual({
        summary: "title",
        description: "3",
      });
      expect(apiResponse3?.[1]).toEqual("ApiOperation");

      const apiResponse4 = decoratorMockCalls[3];
      expect(apiResponse4?.[0]).toEqual({
        summary: "title",
        description: "4",
      });
      expect(apiResponse4?.[1]).toEqual("ApiOperation");
    });
  });

  describe("decorator composition", () => {
    it("should respect default insertion order", async () => {
      const array = ApiSpecification({
        apiExtraModelsOptions: (apiDecorator) => [],
        apiResponseOptions: (apiDecorator) => [
          apiDecorator({
            status: 200,
            description: "1",
          }),
          apiDecorator({ status: 200, description: "2" }),
        ],
        apiOperationOptions: (apiDecorator) => [
          apiDecorator({
            summary: "title",
            description: "3",
          }),
          apiDecorator({ summary: "title", description: "4" }),
        ],
      });

      const mockedArray = array as unknown as Parameters<
        typeof ApiResponse | typeof ApiOperation | typeof ApiExtraModels
      >[];

      expect(mockedArray).toHaveLength(4);

      const apiResponse1 = mockedArray[0];
      expect(apiResponse1?.[0]).toEqual({ status: 200, description: "1" });
      expect(apiResponse1?.[1]).toEqual("ApiResponse");

      const apiResponse2 = mockedArray[1];
      expect(apiResponse2?.[0]).toEqual({ status: 200, description: "2" });
      expect(apiResponse2?.[1]).toEqual("ApiResponse");

      const apiOperationOptions3 = mockedArray[2];
      expect(apiOperationOptions3?.[0]).toEqual({
        summary: "title",
        description: "3",
      });
      expect(apiOperationOptions3?.[1]).toEqual("ApiOperation");

      const apiOperationOptions4 = mockedArray[3];
      expect(apiOperationOptions4?.[0]).toEqual({
        summary: "title",
        description: "4",
      });
      expect(apiOperationOptions4?.[1]).toEqual("ApiOperation");
    });

    it("should respect ordered insertion order", async () => {
      const array = ApiSpecification({
        apiResponseOptions1: (apiDecorator) => [
          apiDecorator({
            status: 200,
            description: "3",
          }),
          apiDecorator({ status: 200, description: "4" }),
        ],
        apiOperationOptions: (apiDecorator) => [
          apiDecorator({
            summary: "title",
            description: "1",
          }),
          apiDecorator({ summary: "title", description: "2" }),
        ],
      });

      const mockedArray = array as unknown as Parameters<
        typeof ApiResponse | typeof ApiOperation | typeof ApiExtraModels
      >[];

      expect(mockedArray).toHaveLength(4);

      const apiOperations1 = mockedArray[0];
      expect(apiOperations1?.[0]).toEqual({
        summary: "title",
        description: "1",
      });
      expect(apiOperations1?.[1]).toEqual("ApiOperation");

      const apiOperations2 = mockedArray[1];
      expect(apiOperations2?.[0]).toEqual({
        summary: "title",
        description: "2",
      });
      expect(apiOperations2?.[1]).toEqual("ApiOperation");

      const apiResponse3 = mockedArray[2];
      expect(apiResponse3?.[0]).toEqual({ status: 200, description: "3" });
      expect(apiResponse3?.[1]).toEqual("ApiResponse");

      const apiResponse4 = mockedArray[3];
      expect(apiResponse4?.[0]).toEqual({ status: 200, description: "4" });
      expect(apiResponse4?.[1]).toEqual("ApiResponse");
    });

    it("should respect insertion order with explicit 0 order", async () => {
      const array = ApiSpecification({
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

      const mockedArray = array as unknown as Parameters<
        typeof ApiResponse | typeof ApiOperation | typeof ApiExtraModels
      >[];

      expect(mockedArray).toHaveLength(3);

      const apiResponse1 = mockedArray[0];
      expect(apiResponse1?.[0]).toEqual({
        status: 200,
        description: "1",
      });
      expect(apiResponse1?.[1]).toEqual("ApiResponse");

      const apiResponse2 = mockedArray[1];
      expect(apiResponse2?.[0]).toEqual({
        status: 200,
        description: "2",
      });
      expect(apiResponse2?.[1]).toEqual("ApiResponse");

      const apiResponse3 = mockedArray[2];
      expect(apiResponse3?.[0]).toEqual({
        status: 200,
        description: "3",
      });
      expect(apiResponse3?.[1]).toEqual("ApiResponse");
    });

    it("should respect negative order", async () => {
      const array = ApiSpecification({
        "apiResponseOptions-1": (apiDecorator) => [
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
        apiResponseOptions: (apiDecorator) => [
          apiDecorator({
            status: 200,
            description: "3",
          }),
        ],
      });

      const mockedArray = array as unknown as Parameters<
        typeof ApiResponse | typeof ApiOperation | typeof ApiExtraModels
      >[];

      expect(mockedArray).toHaveLength(3);

      const apiResponse1 = mockedArray[0];
      expect(apiResponse1?.[0]).toEqual({
        status: 200,
        description: "1",
      });
      expect(apiResponse1?.[1]).toEqual("ApiResponse");

      const apiResponse2 = mockedArray[1];
      expect(apiResponse2?.[0]).toEqual({
        status: 200,
        description: "2",
      });
      expect(apiResponse2?.[1]).toEqual("ApiResponse");

      const apiResponse3 = mockedArray[2];
      expect(apiResponse3?.[0]).toEqual({
        status: 200,
        description: "3",
      });
      expect(apiResponse3?.[1]).toEqual("ApiResponse");
    });
  });

  describe("validations", () => {
    it("should throw on incorrect option format name passed", async () => {
      expect(() =>
        ApiSpecification({
          apiInvalidName: (apiDecorator: unknown) => [],
        } as any),
      ).toThrow(
        "Invalid specification option name: 'apiInvalidName'. Correct option name has '<apiDecoratorName>Options<orderNumber | ''>' format.",
      );
    });

    it("should throw on incorrect decorator name passed", async () => {
      expect(() =>
        ApiSpecification({
          apiInvalidDecoratorNameOptions: (apiDecorator: unknown) => [],
        } as any),
      ).toThrow(
        "Invalid specification option name: 'apiInvalidDecoratorNameOptions'. There is no such decorator like: 'ApiInvalidDecoratorName'",
      );
    });

    it("should throw on no options passed", async () => {
      expect(() => ApiSpecification({})).toThrow(
        "ApiSpecification decorator must define at least one supported Api decorator.",
      );
    });

    it("should filter out not supported decorators", async () => {
      expect(() =>
        ApiSpecification({
          apiPropertyOptions: (apiDecorator: unknown) => [],
          apiPropertyOptionalOptions: (apiDecorator: unknown) => [],
          apiHidePropertyOptions: (apiDecorator: unknown) => [],
          apiHidePropertyOptions1234: (apiDecorator: unknown) => [],
        } as any),
      ).toThrow(
        "ApiSpecification decorator must define at least one supported Api decorator.",
      );
    });
  });
});

describe("ApiOptions", () => {
  it("intellisense should work", () => {
    const options: ApiOptions = {
      apiQueryOptions: (apiDecorator) => [],
    };
  });
});
