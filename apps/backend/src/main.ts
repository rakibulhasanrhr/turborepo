import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalGuards();
  app.useGlobalPipes()
  await app.listen(process.env.PORT || 3009);
  console.log(`Connected in PORT ${process.env.PORT}`);
}

bootstrap();
