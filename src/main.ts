import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { VersioningType, ClassSerializerInterceptor, ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import csurf from 'csurf';
import { EnvironmentVariables, Environment } from '@common/env.validation';
import { AppModule } from './app.module';
import setupSwagger from './swagger';
import { AppExceptionFilter } from '@filters/app-exception.filter';
import { I18nService } from 'nestjs-i18n';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService: ConfigService<EnvironmentVariables> = app.get(ConfigService);

  const reflector = app.get(Reflector);

  const i18nService: I18nService<Record<string, unknown>> = app.select(AppModule).get(I18nService);

  //#region App Settings
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AppExceptionFilter(i18nService, new Logger()));

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.use(helmet());
  app.use(csurf());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors();
  //#endregion

  const currentEnv = configService.get('NODE_ENV', { infer: true });

  if (currentEnv != Environment.PRODUCTION) {
    setupSwagger(app);
  }
  await app.listen(configService.get('PORT', { infer: true }));
}
bootstrap();
