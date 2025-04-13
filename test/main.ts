import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import { I18nValidationException, I18nValidationFilter } from '../src';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(
    AppModule,
    //  new ExpressAdapter()
    new FastifyAdapter()
  );
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors): I18nValidationException =>
        new I18nValidationException(errors),
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new I18nValidationFilter(adapterHost, { fallbackLanguage: 'vi' })
  );
  await app.listen(3000);
}

void bootstrap();
