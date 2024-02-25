import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/routes';
import { ApiErrorResponse, IdResponse } from '@src/libs/api';
import { AggregateID } from '@src/libs/ddd';
import { RegisterBookerCommand } from '@src/modules/booker/application/commands/register-booker/register-booker.command';
import { BookerAlreadyExistsError } from '@src/modules/booker/domain/booker.errors';
import { BookerRegisteredEvent } from '@src/modules/booker/domain/events/booker-registered.event';
import { Result } from 'oxide.ts';
import { RegisterBookerRequest } from './register-booker.request';

@Controller(routesV1.version)
export class RegisterBookerHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @ApiOperation({ summary: 'Register a booker', tags: ['booker'] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: BookerAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post(routesV1.booker.root)
  async createBooker(
    @Body() registerBookerRequest: RegisterBookerRequest,
  ): Promise<IdResponse> {
    const command = new RegisterBookerCommand(registerBookerRequest);
    const result: Result<AggregateID, BookerAlreadyExistsError> =
      await this.commandBus.execute(command);

    if (result.isErr()) {
      if (result.unwrapErr() instanceof BookerAlreadyExistsError) {
        throw new ConflictException(result.unwrapErr().message);
      }

      throw new InternalServerErrorException();
    }

    const bookerId = result.unwrap();
    this.eventEmitter.emit(BookerRegisteredEvent.eventName, {
      id: bookerId,
      email: registerBookerRequest.email,
      password: registerBookerRequest.password,
    });

    return new IdResponse(bookerId);
  }
}
