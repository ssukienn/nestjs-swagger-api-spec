import { Injectable } from '@nestjs/common';
import { Hello } from './app.controller';

@Injectable()
export class AppService {
  getHello(): Hello {
    const hello = new Hello();
    hello.hello = 'hello';
    hello.world = 'World';
    hello.anotherWorld = 'Another World';

    return hello;
  }
}
