import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
  });

  // initialize validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // getting .env port
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  // swagger initialize
  const documentConfig = new DocumentBuilder()
    .setTitle('Marketplace API')
    .setDescription('The marketplace API description for documentation of API')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(port);
}
bootstrap();
