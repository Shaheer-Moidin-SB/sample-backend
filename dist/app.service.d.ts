import { CreateUserRequest } from './create-user-request.dto';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { CreateOrderRequest } from './create-order-request.dto';
export declare class AppService {
    private readonly communicationClient;
    private readonly analyticsClient;
    private readonly billingClient;
    private readonly user;
    constructor(communicationClient: ClientProxy, analyticsClient: ClientProxy, billingClient: ClientKafka);
    getHello(): string;
    createUser(createUserRequest: CreateUserRequest): Promise<void>;
    getAnalytics(): Promise<import("rxjs").Observable<any>>;
    createOrder({ userId, price }: CreateOrderRequest): Promise<import("rxjs").Observable<any>>;
}
