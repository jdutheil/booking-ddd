import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { mainConfig } from './main.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  mainConfig(app);

  const config = new DocumentBuilder()
    .setTitle('Booking API')
    .setDescription('API for booking app')
    .setVersion('1.0')
    .addTag('booker')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
