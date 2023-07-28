import { EnvironmentVariables } from '@common/env.validation';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', { infer: true }),
        port: configService.get('DB_PORT', { infer: true }),
        username: configService.get('DB_USER', { infer: true }),
        password: configService.get('DB_PASS', { infer: true }),
        database: configService.get('DB_NAME', { infer: true }),
        logging: configService.get('DB_LOG', { infer: true }),
        entities: [path.join(`${__dirname}/**/entities/*.entity.{ts,js}`)],
        migrationsRun: true,
        migrationsTransactionMode: 'each',
        migrations: [path.join(`${__dirname}/**/migrations/*.{ts,js}`)],
      }),
    }),
  ],
})
export class DatabaseModule {}
