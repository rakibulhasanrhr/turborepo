import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalGuards();
  await app.listen(process.env.PORT ?? 3025);
  console.log(`Connected in PORT ${process.env.PORT}`);
}

bootstrap();
