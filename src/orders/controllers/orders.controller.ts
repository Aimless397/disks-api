import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderDto } from '../dtos/response/get-orders.dto';
import { OrdersService } from '../services/orders.service';
import { Roles } from '../../users/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../users/guards/roles.guard';
import { Role } from '../../users/enums/user-role.enum';
import { CreateCartProductDto } from '../dtos/request/create-cart-product.dto';
import { CartProductDto } from '../dtos/response/get-cart-product.dto';
import { UpdateOrderDto } from '../dtos/request/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders paid' })
  @ApiResponse({ status: 200, description: 'List of all orders' })
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getOrders(): Promise<OrderDto[]> {
    return this.ordersService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Endpoint to create an order' })
  @ApiResponse({ status: 200, description: 'Order created' })
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createOrder(@Request() req): Promise<OrderDto> {
    return this.ordersService.create({ uuid: req.user.uuid });
  }

  @Post()
  @ApiOperation({
    summary: 'Endpoint to add products to a specific order cart',
  })
  @ApiResponse({ status: 200, description: 'Add products to an order' })
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createCartProduct(
    @Body() orderUuid: string,
    createCartProductDto: CreateCartProductDto,
  ): Promise<CartProductDto> {
    return this.ordersService.createCartProduct(
      orderUuid,
      createCartProductDto,
    );
  }

  @Patch()
  @ApiOperation({
    summary: 'Endpoint to pay a cart and convert it to order',
  })
  @ApiResponse({ status: 200, description: 'Generate an order from a cart' })
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  payment(@Body() updateOrderDto: UpdateOrderDto): Promise<OrderDto> {
    return this.ordersService.payment(updateOrderDto);
  }
}
