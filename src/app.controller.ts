import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserRequest } from './create-user-request.dto';
import { CreateOrderRequest } from './create-order-request.dto';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from './guards/auth.guard';
import { AuthFlag } from './decorators/auth-flag.decorator';
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
  @UseGuards(AuthGuard)
  @AuthFlag('privateRoute')
  async createUser(@Body() createUserRequest: CreateUserRequest) {
    try {
      return await this.appService.createUser(createUserRequest);
    } catch (oError) {
      throw new HttpException(oError, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('analytics')
  @UseGuards(AuthGuard)
  @AuthFlag('privateRoute')
  async getAnalytics() {
    try {
      return this.appService.getAnalytics();
    } catch (oError) {
      throw new HttpException(oError, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('create-order')
  @UseGuards(AuthGuard)
  @AuthFlag('privateRoute')
  async createOrder(
    @Body() createOrderRequest: CreateOrderRequest,
    // @CurrentUser() userId: string,
  ) {
    try {
      const orderData = await this.appService.createOrder(createOrderRequest);
      return orderData;
    } catch (oError) {
      throw new HttpException(oError, HttpStatus.UNAUTHORIZED);
    }
  }

  onModuleInit() {
    this.authClient.subscribeToResponseOf('authorize_user');
    this.billingClient.subscribeToResponseOf('order_created');
  }
}
