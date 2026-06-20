import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Patch BigInt toJSON to allow serialization of BigInt fields in DB models
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(3001);
  console.log(`Backend API running on: http://localhost:3001/api`);
}
bootstrap();
