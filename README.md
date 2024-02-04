Motivation
===

Tidying up `@Controller` classes and methods  (`@Get` route handler etc.) from `@nestjs/swagger` 
OpenAPI decorators pollution. All relevant OpenAPI decorators from `@nestjs/swagger` can be applied by using single decorator.


## Requirements

* minimal `@nestjs/common@^7.6.0`
* minimal `@nestjs/swagger@^4.8.1`

For details check `package.json` ranges.

## Usage

### 1. Install dependency

```
$ npm install nestjs-swagger-api-spec
```

### 2. Use `@ApiSpecification` decorator

Decorate controller or handler wih `@ApiSpecification`. It can apply all `@Api` decorators passed in. 

The order of decorator expressions depends on the [ECMAScript iteration order of keys](https://tc39.es/ecma262/#sec-ordinaryownpropertykeys). `ApiOptiona` keys (i.e. `apiResponseOptions`) are only strings so chronological order is guaranteed.
The order of expressions depends on the Typescript [decorator composition](https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-composition) and the order in which Nest applies decorators.


```typescript
import { ApiSpecification, ApiOptions } from 'nestjs-swagger-api-spec';

const exampleSpec: ApiOptions = {
    apiResponseOptions: apiDecorator => [apiDecorator({status: 201, type: Number}), apiDecorator(...), ...],
    //..
}

@ApiSpecification(exampleSpec)
@Controller()
class Example {
    
    @Get()
    @ApiSpecification({
        apiResponseOptions: apiDecorator => [apiDecorator({status: 200, type: Number}), apiDecorator(...), ...]
        //...
    })
    getExample() {
        //...
    }
}
````

## Caveats

The implementation depends on:
- the decorator factories being named with `Api` prefix. So any decorator diverging from this convention will not be applied.
- breaking the contract of `applyDecorators` in future Nest versions.

There were no changes that would break the contract in `@nestjs/common` since `6.9.0` and each decorator in `@nestjs/swagger` has `Api` prefix
so it should be safe to use.

## Getting Support & Contributing

- Open issue or pull request.

## License

- [MIT licensed](LICENSE).
