import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { DisksService } from '../../disks/services/disks.service';
import { SendgridService } from '../../email/services/sendgrid.service';
import { prisma } from '../../prisma';
import { CreateCartProductDto } from '../dtos/request/create-cart-product.dto';
import { CreateOrderDto } from '../dtos/request/create-order.dto';
import { GetOrderDto } from '../dtos/request/get-order.dto';
import { UpdateOrderDto } from '../dtos/request/update-order.dto';
import { CartProductDto } from '../dtos/response/get-cart-product.dto';
import { OrderDto } from '../dtos/response/get-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly sendgridService: SendgridService,
    private readonly disksService: DisksService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getAll(): Promise<OrderDto[]> {
    const orders = await prisma.order.findMany({ where: { paid: true } });

    return plainToInstance(OrderDto, orders);
  }

  async create(input: CreateOrderDto): Promise<OrderDto> {
    const user = await prisma.user.findUnique({ where: { uuid: input.uuid } });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: 0,
        paid: false,
      },
    });

    return plainToInstance(OrderDto, order);
  }

  async createCartProduct(
    uuid: string,
    userUuid: string,
    input: CreateCartProductDto,
  ): Promise<CartProductDto> {
    const order = await prisma.order.findUnique({ where: { uuid } });
    const user = await prisma.user.findUnique({ where: { id: order.userId } });
    if (user.uuid !== userUuid) {
      throw new NotFoundException(`Order doesn't belong to user`);
    }
    const disk = await prisma.disk.findUnique({
      where: { uuid: input.diskUuid },
    });

    if (disk.stock < input.amount) {
      throw new BadRequestException(
        'Quantity to buy exceeds the available stock',
      );
    }

    /* const diskUpdated = await prisma.disk.update({
      data: {
        stock: disk.stock - input.amount,
      },
      where: {
        uuid: input.diskUuid,
      },
    }); */

    const cartProduct = await prisma.cartProduct.create({
      data: {
        diskId: disk.id,
        amount: input.amount,
        orderId: order.id,
        selectionPrice: input.amount * disk.price,
      },
    });

    return plainToInstance(CartProductDto, cartProduct);
  }

  async payment(input: UpdateOrderDto): Promise<OrderDto> {
    const order = await prisma.order.findUnique({
      where: { uuid: input.uuid },
    });

    // TODO: TEST IT
    if (order.paid) {
      throw new BadRequestException('Order already paid');
    }
    //

    const cartProducts = await prisma.cartProduct.findMany({
      where: { orderId: order.id },
    });

    // TODO: TEST IT
    if (!cartProducts.length) {
      throw new NotFoundException('No products added yet');
    }

    const diskIds: number[] = [];
    // TODO: TEST IT
    for (const cartProduct of cartProducts) {
      const disk = await prisma.disk.findUnique({
        where: { id: cartProduct.diskId },
      });

      if (disk.stock < cartProduct.amount) {
        throw new BadRequestException(
          'Quantity to buy exceeds the available stock',
        );
      }

      const diskUpdated = await prisma.disk.update({
        data: {
          stock: disk.stock - cartProduct.amount,
        },
        where: {
          uuid: disk.uuid,
        },
      });

      if (diskUpdated.stock <= 3) {
        diskIds.push(diskUpdated.id);
      }
      /* }); */
      //
    }

    const totalPrice = cartProducts
      .map((a) => a.selectionPrice)
      .reduce((a, b) => a + b);

    const orderUpdated = await prisma.order.update({
      data: {
        total: totalPrice,
        paid: true,
      },
      where: { uuid: input.uuid },
    });

    this.eventEmitter.emit('order.updated', diskIds);

    return plainToInstance(OrderDto, orderUpdated);
  }

  async getOrder(input: GetOrderDto): Promise<OrderDto> {
    const order = await prisma.order.findUnique({
      where: { uuid: input.orderUuid },
    });
    const user = await prisma.user.findUnique({
      where: { uuid: input.userUuid },
    });

    if (order.userId !== user.id) {
      throw new NotFoundException();
    }

    return plainToInstance(OrderDto, order);
  }
}
