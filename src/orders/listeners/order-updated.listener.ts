/* eslint-disable no-console */
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DisksService } from '../../disks/services/disks.service';
import { SendgridService } from '../../email/services/sendgrid.service';
import { prisma } from '../../prisma';

@Injectable()
export class OrderUpdatedListener {
  constructor(
    private readonly sendgridService: SendgridService,
    private readonly disksService: DisksService,
  ) {}

  @OnEvent('order.updated')
  async handleOrderUpdatedEvent(diskIds: number[]) {
    try {
      // diskIds tiene todos los IDs de los discos que se actualizaron y llegaron a 3
      // para todos esos IDs, encontrar todas las reacciones existentes en orden descendente de like, y para cada usuario de esa reacción, averiguar si tiene un cartProduct con ese disco y que su orden del cartProduct esté como paid = false
      // reacciones con ID de los discos afectados
      const userReactions = await prisma.userReaction.findMany({
        where: { diskId: { in: diskIds }, like: true },
        select: { userId: true },
        orderBy: { likedAt: 'desc' },
      });
      // usuarios que reaccionaron con like al disco
      const userIds = userReactions.map((ur) => ur.userId);
      // carritos con ID de los discos afectados
      const cartProducts = await prisma.cartProduct.findMany({
        where: { diskId: { in: diskIds } },
      });
      // ID's de las órdenes de los carritos que contienen el disco afectado
      const cartOrderIds = cartProducts.map((cart) => cart.orderId);
      // órdenes que contienen carritos con el disco afectado
      const cartOrders = await prisma.order.findMany({
        where: { id: { in: cartOrderIds } },
        select: { userId: true },
      });
      const userIdsOrders = cartOrders.map((order) => order.userId);

      // verificar que esos userIds no pertenezcan a ninguna orden pagada con ese disco y enviarles email a ellos también
      /* userIds.forEach((userId) => {}); */
      const emailSent: { userId: number; diskId: number }[] = [];
      for (const userId of userIds) {
        for (const cart of cartProducts) {
          // lógica de si el usuario no pertenece a la orden
          if (!userIdsOrders.includes(userId)) {
            // si el usuario junto al disco no forman parte de la lista de correos enviados, enviar correo
            if (
              !emailSent.some(
                (arr) => arr.userId === userId && arr.diskId === cart.diskId,
              )
            ) {
              emailSent.push({ userId, diskId: cart.diskId });
              const user = await prisma.user.findUnique({
                where: { id: userId },
              });
              const disk = await prisma.disk.findUnique({
                where: { id: cart.diskId },
              });
              const diskFound = await this.disksService.findOne(disk.uuid);

              // send mail to user who liked and didn't buy
              await this.sendgridService.sendEmail({
                email: user.email,
                objective: 'buy',
                diskImage: diskFound.cover,
              });
            }
          }
        }
      }

      // órdenes de discos afectados
      const orderIds = cartProducts.map((cart) => cart.orderId);
      // todas las órdenes de los usuarios que reaccionaron al disco y no lo compraron
      const orders = await prisma.order.findMany({
        where: {
          id: { in: orderIds },
          /* userId: { in: userIds }, */ paid: false,
        },
      });
      if (!orders.length) {
        return;
      }
      const orderIdsValid = orders.map((order) => order.id);
      const validCarts = cartProducts.map((cart) => {
        if (orderIdsValid.includes(cart.orderId)) {
          return cart;
        }
      });

      // send email
      validCarts.forEach(async (validCart) => {
        const user = await prisma.user.findUnique({
          where: {
            id: orders.find((order) => order.id === validCart.orderId).userId,
          },
        });
        const disk = await prisma.disk.findUnique({
          where: { id: validCart.diskId },
        });
        const diskFound = await this.disksService.findOne(disk.uuid);

        await this.sendgridService.sendEmail({
          email: user.email,
          objective: 'buy',
          diskImage: diskFound.cover,
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
