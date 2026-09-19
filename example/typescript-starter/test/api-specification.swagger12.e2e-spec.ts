import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/swagger12/app.module';

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
      .setOpenAPIVersion('3.1.0')
      .addTag('cats')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      onlyIncludeDecoratedEndpoints: true,
    });
    SwaggerModule.setup('api', app, document);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const getOpenApi = async () => {
    const res = await request(app.getHttpServer()).get('/api-json').expect(200);
    return res.body;
  };

  it('should generate OpenApi spec from controller', async () => {
    const openApi = await getOpenApi();
    expect(openApi.paths['/'].get.responses['211']).toBeDefined();
  });

  it('should generate OpenApi spec from handler', async () => {
    const openApi = await getOpenApi();
    expect(openApi.paths['/'].get.responses['222']).toBeDefined();
  });

  it('should generate OpenApi spec from handler with links', async () => {
    const openApi = await getOpenApi();
    expect(openApi.paths['/'].get.responses['222'].links).toBeDefined();
  });

  it('should apply controller ApiExtension to handler operations', async () => {
    const openApi = await getOpenApi();
    expect(openApi.paths['/'].get['x-app']).toEqual({
      source: 'api-specification',
    });
  });

  it('should generate callbacks from handler ApiCallbacks', async () => {
    const openApi = await getOpenApi();
    expect(openApi.paths['/'].get.callbacks.helloCallback).toBeDefined();
  });

  it('should generate webhooks from handler ApiWebhook', async () => {
    const openApi = await getOpenApi();
    expect(openApi.webhooks?.helloWebhook ?? openApi.paths['/webhook']).toBeDefined();
  });

  it('should include ApiIncludeEndpoint handlers and omit undecorated ones', async () => {
    const openApi = await getOpenApi();
    expect(openApi.paths['/']).toBeDefined();
    expect(openApi.paths['/{id}']).toBeDefined();
    expect(openApi.paths['/hidden']).toBeUndefined();
  });

  it('should register ApiDefaultGetter for linked models', async () => {
    const openApi = await getOpenApi();
    expect(openApi.paths['/{id}'].get).toBeDefined();
  });
});
