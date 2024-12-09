Motivation
===

Simplify the management of `@Controller` classes and methods (e.g., `@Get` route handler) by addressing the issue of OpenAPI decorators pollution from `@nestjs/swagger`. This library provides a streamlined approach to apply all relevant OpenAPI decorators using a single decorator.

## Requirements

* minimal `@nestjs/common@^10`
* minimal `@nestjs/swagger@^7`

For specific version details, refer to `package.json`.


## Usage

### 1. Install the Dependency

```
$ npm install nestjs-swagger-api-spec
```

### 2. Use `@ApiSpecification` Decorator

Apply the `@ApiSpecification` decorator to controllers or handlers to automatically add relevant `@Api<name>` decorators. Decorator order is determined by ECMAScript iteration order for keys and can be adjusted using order suffixes.


### Example
```typescript
import { ApiSpecification, ApiOptions } from 'nestjs-swagger-api-spec';

const exampleSpec: ApiOptions = {
    apiResponseOptions: (apiDecorator) => apiDecorator({ status: 200, description: "Applied in the middle, defined first." }),
    apiOperationOptions1: (apiDecorator) => [
        apiDecorator({
            summary: "title",
            description: "3",
        }),
        apiDecorator({ summary: "title", description: "Applied last, defined in the middle." }),
    ],
    'apiOperationOptions-1': (apiDecorator) => apiDecorator({ status: 200, description: "Applied first, defined last." },
    //...
}

@ApiSpecification(exampleSpec)
@Controller()
class Example {
    
    @Get()
    @ApiSpecification({
        apiOperationOptions1: (apiDecorator) => apiDecorator({
            summary: "customTitle",
            description: "customDescription",
        }),
        // Additional decorators...
    })
    getExample() {
        //...
    }
}
```

### Decorator Ordering

The order of decorators can be customized by adding a suffix number to the options properties. Positive numbers define the order in ascending fashion, while negative numbers represent the order in descending fashion. For instance, `apiOperationOptions1` and `'apiOperationOptions-1'` will apply decorators in different orders. Default order is `0`.

## Caveats

* Decorator factories must be named with the Api prefix.
* Using property names with a format other than expected may result in errors.
* `ApiProperty`, `ApiPropertyOptional`, and `ApiHideProperty` decorators are not supported for route handler decorators.
* Future Nest versions breaking the contract of applyDecorators may impact the implementation.

## Getting Support & Contributing

* Open issues or pull requests for support or contributions.

## License

- [MIT licensed](LICENSE).
