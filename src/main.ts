import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: '4003'
    }
  });
 
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.startAllMicroservices();

  await app.listen(3003);
  console.log('App running on port: 3003');
}
bootstrap();
