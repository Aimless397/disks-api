import { OrderFactory } from '../../utils/factories/order.factory';
import { prisma } from '../../prisma';
import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { OrdersService } from './orders.service';
import { Order } from '@prisma/client';
import { UserFactory } from '../../utils/factories/user.factory';
import * as faker from 'faker';
import { DiskFactory } from '../../utils/factories/disk.factory';
import { DisksService } from '../../disks/services/disks.service';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let orders: Order[];
  let userFactory: UserFactory;
  let diskFactory: DiskFactory;
  let orderFactory: OrderFactory;

  beforeAll(() => {
    diskFactory = new DiskFactory(prisma);
    orderFactory = new OrderFactory(prisma);
    userFactory = new UserFactory(prisma);
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '24h' },
        }),
      ],
      providers: [OrdersService, DisksService],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
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
      const amount = faker.datatype.number(5);
      const disk = await diskFactory.make();

      const order = await ordersService.create({
        uuid: (await userFactory.make()).uuid,
        total: 0,
        paid: false,
      });

      const cartProduct = await ordersService.createCartProduct(order.uuid, {
        orderId: order.id,
        diskId: disk.id,
        amount,
        selectionPrice: amount * disk.price,
        state: true,
      });

      order.total = cartProduct.selectionPrice;
      order.paid = true;

      const orderUpdated = await ordersService.payment(order);

      expect(orderUpdated).toHaveProperty('uuid');
      expect(orderUpdated).toHaveProperty('userId');
      expect(orderUpdated).toHaveProperty('total');
      expect(orderUpdated).toHaveProperty('paid');
    });
  });
});
