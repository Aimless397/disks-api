import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlGetUser } from '../../auth/decorators/gql-get-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { Roles } from '../../users/decorators/roles.decorator';
import { Role } from '../../users/enums/user-role.enum';
import { GqlRolesGuard } from '../../users/guards/gql-roles.guard';
import { User } from '../../users/models/user.model';
import { CartProductInput } from '../dtos/input/cart-product.input';
import { CartProduct } from '../models/cart-product.model';
import { Order } from '../models/order.model';
import { OrdersService } from '../services/orders.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @Query(() => [Order])
  @Roles(Role.MANAGER)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  getOrders() {
    return this.ordersService.getAll();
  }

  @Query(() => Order)
  @Roles(Role.CLIENT)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  getOrder(@Args('uuid') uuid: string, @GqlGetUser() user: User) {
    return this.ordersService.getOrder({
      orderUuid: uuid,
      userUuid: user.uuid,
    });
  }

  @Mutation(() => Order)
  @Roles(Role.CLIENT)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  createOrder(@GqlGetUser() user) {
    return this.ordersService.create({ uuid: user.uuid });
  }

  @Mutation(() => CartProduct)
  @Roles(Role.CLIENT)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  createCartProduct(
    @Args('uuid') uuid: string,
    @Args('cartProductInput') cartProductInput: CartProductInput,
    @GqlGetUser() user: User,
  ) {
    return this.ordersService.createCartProduct(
      uuid,
      user.uuid,
      cartProductInput,
    );
  }

  @Mutation(() => Order)
  @Roles(Role.CLIENT)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  payOrder(@Args('uuid') uuid: string) {
    return this.ordersService.payment({ uuid });
  }
}
