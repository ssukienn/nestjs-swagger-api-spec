import { Injectable } from '@nestjs/common';
import { Hello } from './app.controller';

@Injectable()
export class AppService {
  getHello(): Hello {
    const hello = new Hello();
    hello.hello = 'hello';

    return hello;
  }
}
