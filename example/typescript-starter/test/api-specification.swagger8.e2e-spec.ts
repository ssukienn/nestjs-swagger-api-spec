import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/swagger8/app.module';

describe('@ApiSpecification', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const config = new DocumentBuilder()
      .setTitle('Cats example')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addTag('cats')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should generate OpenApi spec from controller', async () => {
    const openApiResCode = '211';

    const res = await request(app.getHttpServer()).get('/api-json').expect(200);

    const response = res.body.paths['/'].get.responses[openApiResCode];
    expect(response).toBeDefined();
  });

  it('should generate OpenApi spec from handler', async () => {
    const openApiResCode = '222';

    const res = await request(app.getHttpServer()).get('/api-json').expect(200);

    const response = res.body.paths['/'].get.responses[openApiResCode];
    expect(response).toBeDefined();
  });

  it('should generate OpenApi spec from handler with links', async () => {
    const openApiResCode = '222';

    const res = await request(app.getHttpServer()).get('/api-json').expect(200);

    const response = res.body.paths['/'].get.responses[openApiResCode];
    expect(response.links).toBeDefined();
  });

  it('should generate OpenApi spec from handler with links', async () => {
    const openApiResCode = '222';

    const res = await request(app.getHttpServer()).get('/api-json').expect(200);

    const response = res.body.paths['/'].get.responses[openApiResCode];
    expect(response.links).toBeDefined();
  });
});
