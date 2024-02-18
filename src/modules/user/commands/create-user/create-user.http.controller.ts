import { Controller, Post } from '@nestjs/common';
import { routesV1 } from '@src/configs/routes';

@Controller(routesV1.version)
export class CreateUserHttpController {
  @Post(routesV1.user.root)
  async createUser() {
    return 'Hello World';
  }
}
