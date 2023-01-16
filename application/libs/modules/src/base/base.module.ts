import { ConfigService } from '@libs/config';
import { AuthUserInterceptor, LoggingInterceptor } from '@libs/interceptor';
import { CustomLogger as Logger, LoggerMiddleware, RequestContext } from '@libs/middleware';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

const loggers = [Logger, LoggerMiddleware];
const contexts = [RequestContext];
const interceptors = [AuthUserInterceptor, LoggingInterceptor];

@Global()
@Module({
  imports: [HttpModule, JwtModule.register({})],
  providers: [ConfigService, ...loggers, ...contexts, ...interceptors],
  exports: [HttpModule, JwtModule, ConfigService, ...loggers, ...contexts, ...interceptors],
})
export class BaseModule {}
