import { Inject, Injectable } from '@nestjs/common';
import { CreateUserRequest } from './create-user-request.dto';
import { ClientKafka, ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateUserEvent } from './create-user.event';
import { CreateOrderRequest } from './create-order-request.dto';
import { OrderCreatedEvent } from './order-created.event';

@Injectable()
export class AppService {
  private readonly user: any[] = [];

  constructor(
    @Inject('COMMUNICATION') private readonly communicationClient: ClientProxy,
    @Inject('ANALYTICS') private readonly analyticsClient: ClientProxy,
    @Inject('BILLING_SERVICE') private readonly billingClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(createUserRequest: CreateUserRequest) {
    this.user.push(createUserRequest);
    await this.communicationClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email),
    );
    await this.analyticsClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email),
    );
  }

  async getAnalytics() {
    return await this.analyticsClient.send({ cmd: 'get_analytics' }, {});
  }

  async createOrder({ userId, price }: CreateOrderRequest) {
    try {
      return await this.billingClient
        .send('order_created', new OrderCreatedEvent('123', userId, price))
        .toPromise();
    } catch (oError) {
      throw new RpcException('Error while creating order ' + oError);
    }
  }
}
