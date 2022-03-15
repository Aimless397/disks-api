import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { prisma } from '../../prisma';
import { CreateCartProductDto } from '../dtos/request/create-cart-product.dto';
import { CreateOrderDto } from '../dtos/request/create-order.dto';
import { CartProductDto } from '../dtos/response/get-cart-product.dto';
import { OrderDto } from '../dtos/response/get-orders.dto';
import { DisksService } from '../../disks/services/disks.service';
import { UpdateOrderDto } from '../dtos/request/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private disksService: DisksService) {}

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
    input: CreateCartProductDto,
  ): Promise<CartProductDto> {
    const order = await prisma.order.findUnique({
      where: { uuid },
    });
    const disk = await prisma.disk.findUnique({ where: { id: input.diskId } });
    const cartProduct = await prisma.cartProduct.create({
      data: {
        ...input,
        orderId: order.id,
        selectionPrice: input.amount * disk.price,
      },
    });

    return plainToInstance(CartProductDto, cartProduct);
  }

  async payment(input: UpdateOrderDto): Promise<OrderDto> {
    const cartProducts = await prisma.cartProduct.findMany({
      where: { orderId: input.id },
    });

    const totalPrice = cartProducts
      .map((a) => a.selectionPrice)
      .reduce((a, b) => a + b);

    const orderUpdated = await prisma.order.update({
      data: {
        ...input,
        total: totalPrice,
        paid: true,
      },
      where: { id: input.id },
    });

    return plainToInstance(OrderDto, orderUpdated);
  }
}
