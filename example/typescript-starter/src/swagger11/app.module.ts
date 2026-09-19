import { Module } from '@nestjs/common';
import { AppController, SomeController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, SomeController],
  providers: [AppService],
})
export class AppModule {}
