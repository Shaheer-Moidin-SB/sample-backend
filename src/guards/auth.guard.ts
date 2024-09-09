import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { GetUserRequest } from 'src/dto/get-user-request.dto';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientKafka) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.body;

    if (!userId) {
      return false; // No userId means unauthorized
    }

    console.log('sending user for authorization');
    // Send the authorization request to the auth service
    const isAuthorized = await this.authClient
      .send('authorize_user', new GetUserRequest(userId))
      .toPromise();
    console.log('User Authorized Successfully! Welcome');
    return isAuthorized; // Allow or deny access based on the response
  }
}
