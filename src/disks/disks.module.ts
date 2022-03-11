import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/services/users.service';
import { DisksController } from './controllers/disks.controller';
import { DisksService } from './services/disks.service';

@Module({
  imports: [AuthModule],
  controllers: [DisksController],
  providers: [DisksService, UsersService],
})
export class DisksModule {}
