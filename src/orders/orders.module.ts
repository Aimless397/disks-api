import { Module } from '@nestjs/common';
import { DisksService } from '../disks/services/disks.service';
import { DisksModule } from '../disks/disks.module';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [DisksModule],
  controllers: [OrdersController],
  providers: [OrdersService, DisksService],
})
export class OrdersModule {}
