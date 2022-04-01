import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/services/users.service';
import { DisksController } from './controllers/disks.controller';
import { DisksService } from './services/disks.service';
import { FilesService } from '../files/files.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DisksResolver } from './resolvers/disks.resolver';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [DisksController],
  providers: [DisksService, UsersService, FilesService, DisksResolver],
  exports: [DisksService],
})
export class DisksModule {}
