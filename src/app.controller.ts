import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserRequest } from './create-user-request.dto';
import { CreateOrderRequest } from './create-order-request.dto';
import { RpcException } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
  async createOrder(@Body() createOrderRequest: CreateOrderRequest) {
    try {
      const orderData = await this.appService.createOrder(createOrderRequest);
      const result = {
        status: 'Ok',
        message: 'order created Successfully',
        data: orderData,
      };
      return result;
    } catch (oError) {
      throw new RpcException('Error while creating order ' + oError);
    }
  }
}
