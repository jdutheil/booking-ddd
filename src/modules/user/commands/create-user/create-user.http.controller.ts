import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/routes';
import { ApiErrorResponse, IdResponse } from '@src/libs/api';
import { UserAlreadyExistsError } from '../../domain/user.errors';
import { CreateUserRequestDto } from './create-user.request.dto';

@Controller(routesV1.version)
export class CreateUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: UserAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post(routesV1.user.root)
  async createUser(
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<IdResponse> {
    throw new Error('Not implemented');
  }
}
