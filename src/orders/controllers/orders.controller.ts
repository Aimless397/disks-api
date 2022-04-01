import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../users/decorators/roles.decorator';
import { Role } from '../../users/enums/user-role.enum';
import { RolesGuard } from '../../users/guards/roles.guard';
import { CreateCartProductDto } from '../dtos/request/create-cart-product.dto';
import { OrderUUidDto } from '../dtos/request/order-uuid.dto';
import { CartProductDto } from '../dtos/response/get-cart-product.dto';
import { OrderDto } from '../dtos/response/get-orders.dto';
import { OrdersService } from '../services/orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders paid' })
  @ApiResponse({ status: 200, description: 'List of all orders' })
  @ApiBearerAuth()
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getOrders(): Promise<OrderDto[]> {
    return this.ordersService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Endpoint to create an order' })
  @ApiResponse({ status: 200, description: 'Order created' })
  @ApiBearerAuth()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createOrder(@Request() req): Promise<OrderDto> {
    return this.ordersService.create({ uuid: req.user.uuid });
  }

  @Post('/:uuid/add-to-cart')
  @ApiOperation({
    summary: 'Endpoint to add products to a specific order cart',
  })
  @ApiResponse({ status: 200, description: 'Add products to an order' })
  @ApiBearerAuth()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createCartProduct(
    @Param('uuid') uuid: string,
    @Body() createCartProductDto: CreateCartProductDto,
    @Request() req,
  ): Promise<CartProductDto> {
    return this.ordersService.createCartProduct(
      uuid,
      req.user.uuid,
      createCartProductDto,
    );
  }

  @Patch('/:uuid/payment')
  @ApiOperation({
    summary: 'Endpoint to pay a cart and convert it to order',
  })
  @ApiResponse({ status: 200, description: 'Generate an order from a cart' })
  @ApiBearerAuth()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  payment(@Param() { uuid }: OrderUUidDto): Promise<OrderDto> {
    return this.ordersService.payment({ uuid });
  }

  @Get('/:uuid')
  @ApiOperation({ summary: `Endpoint to get a user's order` })
  @ApiResponse({
    status: 200,
    description: 'Return an order which belongs to the requesting user',
  })
  @ApiBearerAuth()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getOrder(@Request() req, @Param() { uuid }: OrderUUidDto): Promise<OrderDto> {
    return this.ordersService.getOrder({
      orderUuid: uuid,
      userUuid: req.user.uuid,
    });
  }
}
