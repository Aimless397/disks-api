import { NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Disk, Order, User } from '@prisma/client';
import * as faker from 'faker';
import { DisksService } from '../../disks/services/disks.service';
import { SendgridService } from '../../email/services/sendgrid.service';
import { FilesService } from '../../files/files.service';
import { clearDatabase, prisma } from '../../prisma';
import { DiskFactory } from '../../utils/factories/disk.factory';
import { OrderFactory } from '../../utils/factories/order.factory';
import { UserFactory } from '../../utils/factories/user.factory';
import { CartProductDto } from '../dtos/response/get-cart-product.dto';
import { OrderDto } from '../dtos/response/get-orders.dto';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let orders: Order[];
  let userFactory: UserFactory;
  let diskFactory: DiskFactory;
  let orderFactory: OrderFactory;
  let disk: Disk;

  let user: User;
  let amount: number;
  let order: OrderDto;
  let cartProduct: CartProductDto;
  let paidOrder: OrderDto;

  beforeAll(async () => {
    diskFactory = new DiskFactory(prisma);
    orderFactory = new OrderFactory(prisma);
    userFactory = new UserFactory(prisma);
    disk = await diskFactory.make({ stock: 10 });
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '24h' },
        }),
        ConfigModule,
        FilesService,
        SendgridService,
      ],
      providers: [
        OrdersService,
        DisksService,
        FilesService,
        SendgridService,
        EventEmitter2,
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    /* filesService = module.get<OrdersService>(OrdersService); */

    user = await userFactory.make();
    amount = faker.datatype.number(2);
    order = await ordersService.create({
      uuid: user.uuid,
      total: 0,
      paid: false,
    });
    cartProduct = await ordersService.createCartProduct(order.uuid, user.uuid, {
      orderId: order.id,
      diskUuid: disk.uuid,
      amount,
      state: true,
    });
    order.total = cartProduct.selectionPrice;
    order.paid = true;
    paidOrder = await ordersService.payment(order);
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe('getAll', () => {
    it('should return an array of orders', async () => {
      orders = await orderFactory.makeMany(5, {
        user: { connect: { id: (await userFactory.make()).id } },
        total: 0,
        paid: false,
      });

      const result = await ordersService.getAll();

      expect(typeof result).toBe(typeof orders);
    });
  });

  describe('create', () => {
    it('should create a new order with products', async () => {
      const result = paidOrder;

      expect(result).toHaveProperty('uuid');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('paid');
    });
  });

  describe('getOrder', () => {
    it('should return an order which belongs to the requesting user', async () => {
      const result = await ordersService.getOrder({
        orderUuid: paidOrder.uuid,
        userUuid: user.uuid,
      });

      expect(result).toHaveProperty('uuid');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('paid');
    });

    it(`should return a NotFoundException if the order doesn't belong to the requesting user`, async () => {
      const user = await userFactory.make();

      await expect(
        ordersService.getOrder({
          orderUuid: paidOrder.uuid,
          userUuid: user.uuid,
        }),
      ).rejects.toThrowError(new NotFoundException());
    });
  });
});
