import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const Auth = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const userId = req.auth.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return userId;
  },
);
