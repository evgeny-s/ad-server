import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const prefix = '0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(prefix);

  const options = new DocumentBuilder()
    .setTitle('CheckMe')
    .setDescription('CheckMe API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(9000);
}
bootstrap();
