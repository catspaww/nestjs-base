import { Module } from '@nestjs/common';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as path from 'path';
import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@db/database.module';
import { SharedModule } from '@shared/shared.module';
import { EnvironmentVariables, validate } from '@common/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
      validate,
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        level: configService.get('LOG_LEVEL', { infer: true }),
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike(
                configService.get('APP_NAME', { infer: true }),
              ),
            ),
          }),
        ],
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
    }),
    AuthModule,
    DatabaseModule,
    SharedModule,
  ],
})
export class AppModule {}
