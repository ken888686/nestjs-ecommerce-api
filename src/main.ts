import {
  ClassSerializerInterceptor,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // Create base document with all routes
  const baseOptions = new DocumentBuilder()
    .setTitle('Nestjs E-commerce API')
    .setDescription('This is the Nestjs E-commerce API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const baseDocument = SwaggerModule.createDocument(app, baseOptions);

  SwaggerModule.setup('swagger', app, baseDocument, {
    jsonDocumentUrl: '/v1/swagger/json',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
