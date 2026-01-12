import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserModel } from './infrastructure/orm/user.entity';
import { UserAplication } from './application/user.service';
import { SequilizeUserRepository } from './infrastructure/repositories/sequelize-user.repository';
import { TokenModule } from 'src/common/tokens/token.module';

@Module({
  imports: [SequelizeModule.forFeature([UserModel]), TokenModule],
  providers: [
    UsersService,
    UserAplication,
    {
      provide: 'UserRepository',
      useClass: SequilizeUserRepository,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService, 'UserRepository'],
})
export class UsersModule {}
