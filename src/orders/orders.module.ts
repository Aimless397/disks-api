import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DisksModule } from '../disks/disks.module';
import { DisksService } from '../disks/services/disks.service';
import { SendgridService } from '../email/services/sendgrid.service';
import { FilesService } from '../files/files.service';
import { UsersService } from '../users/services/users.service';
import { UsersModule } from '../users/users.module';
import { OrdersController } from './controllers/orders.controller';
import { OrderUpdatedListener } from './listeners/order-updated.listener';
import { OrdersResolver } from './resolvers/orders.resolver';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [UsersModule, DisksModule, ConfigModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    DisksService,
    FilesService,
    OrdersResolver,
    SendgridService,
    OrderUpdatedListener,
    UsersService,
  ],
})
export class OrdersModule {}
