import { configuration } from '@libs/config';
import { HttpExceptionsFilter } from '@libs/filter';
import { LoggerMiddleware } from '@libs/middleware';
import { BaseModule } from '@libs/modules/base';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import '@libs/util/expand-prototype';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';
import path from 'path';
import { UserModule } from './modules/user';
import { ProductModule } from './modules/product';
import { OrderModule } from './modules/order';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.get('db'),
      }),
      inject: [ConfigService],
    }),

    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('mathtutor-api', { prettyPrint: true }),
          ),
        }),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: path.join(process.cwd(), '/logs'),
          filename: '%DATE%.common.log',
          maxFiles: 7,
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('mathtutor-api', { prettyPrint: true }),
          ),
        }),
        new WinstonDaily({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: path.join(process.cwd(), '/logs'),
          filename: '%DATE%.error.log',
          maxFiles: 7,
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('mathtutor-api', { prettyPrint: true }),
          ),
        }),
      ],
    }),

    BaseModule,
    UserModule,
    ProductModule,
    OrderModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionsFilter }],
})
export class AppModule implements NestModule {
  // Global Middleware, Inbound logging
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
