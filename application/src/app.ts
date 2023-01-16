import 'reflect-metadata';
import { ClassSerializerInterceptor, Logger as NestLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';
import { LoggingInterceptor } from '@libs/interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule, setNestApp } from '.';

async function bootstrap(): Promise<string> {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.enableVersioning({ type: VersioningType.URI });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: false,
      validateCustomDecorators: true,
      disableErrorMessages: false,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), await app.resolve(LoggingInterceptor));

  setNestApp(app);
  try {
    await app.listen(process.env.PORT || 5000);
    return app.getUrl();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

(async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
