import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserRequest } from './create-user-request.dto';
import { CreateOrderRequest } from './create-order-request.dto';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { AuthGuard } from './guards/auth.guard';
// import { CurrentUser } from './decorators/current-user.decorator';
@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    @Inject('BILLING_SERVICE') private readonly billingClient: ClientKafka,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async createUser(@Body() createUserRequest: CreateUserRequest) {
    try {
      return await this.appService.createUser(createUserRequest);
    } catch (oError) {
      throw new RpcException('Error while creating order ' + oError);
    }
  }

  @Get('analytics')
  async getAnalytics() {
    try {
      return this.appService.getAnalytics();
    } catch (oError) {
      throw new RpcException('Error while creating order ' + oError);
    }
  }

  @Post('create-order')
  @UseGuards(AuthGuard)
  async createOrder(
    @Body() createOrderRequest: CreateOrderRequest,
    // @CurrentUser() userId: string,
  ) {
    try {
      const orderData = await this.appService.createOrder(createOrderRequest);
      return orderData;
    } catch (oError) {
      throw new RpcException('Error while creating order ' + oError);
    }
  }

  onModuleInit() {
    this.authClient.subscribeToResponseOf('authorize_user');
    this.billingClient.subscribeToResponseOf('order_created');
  }
}
