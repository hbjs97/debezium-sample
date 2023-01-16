import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSerializer, JwtAccessStrategy, JwtService, UserService } from './application';
import { UserCommandRepository, UserQueryRepository } from './infrastructure';
import { UserController } from './interface';
import { User } from './domain';
import { JwtAuthGuard } from '@libs/guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [AuthSerializer, JwtService, JwtAccessStrategy, JwtAuthGuard, UserService, UserQueryRepository, UserCommandRepository],
  exports: [UserService, UserQueryRepository],
})
export class UserModule {}
