import { AppService } from './app.service';
import { CreateUserRequest } from './create-user-request.dto';
import { CreateOrderRequest } from './create-order-request.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    createUser(createUserRequest: CreateUserRequest): Promise<void>;
    getAnalytics(): Promise<import("rxjs").Observable<any>>;
    createOrder(createOrderRequest: CreateOrderRequest): Promise<{
        status: string;
        message: string;
        data: import("rxjs").Observable<any>;
    }>;
}
