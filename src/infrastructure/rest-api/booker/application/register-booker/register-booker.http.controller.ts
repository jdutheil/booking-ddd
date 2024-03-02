import {
  BadRequestException,
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
import { EntityID } from '@src/libs/ddd';
import { RegisterBookerCommand } from '@src/modules/booker/application/commands/register-booker/register-booker.command';
import { BookerAlreadyExistsError } from '@src/modules/booker/domain/booker.errors';
import { BookerEmail } from '@src/modules/booker/domain/value-objects/booker-email';
import { Result } from 'oxide.ts';
import { Public } from '../../../authentication/infrastructure/security/is-public';
import { BookerRegisteredFromSignUpEvent } from '../../domain/events/booker-registered-from-sign-up.event';
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
  @Public()
  @Post(routesV1.booker.root)
  async createBooker(
    @Body() registerBookerRequest: RegisterBookerRequest,
  ): Promise<IdResponse> {
    const { email, password } = registerBookerRequest;

    const emailResult = BookerEmail.create(email);
    if (emailResult.isErr()) {
      throw new BadRequestException(emailResult.unwrapErr().message);
    }
    const bookerEmail = emailResult.unwrap();

    const command = new RegisterBookerCommand({
      email: bookerEmail,
    });
    const result: Result<EntityID, BookerAlreadyExistsError> =
      await this.commandBus.execute(command);

    if (result.isErr()) {
      if (result.unwrapErr() instanceof BookerAlreadyExistsError) {
        throw new ConflictException(result.unwrapErr().message);
      }

      throw new InternalServerErrorException();
    }

    const bookerId = result.unwrap();
    this.eventEmitter.emit(BookerRegisteredFromSignUpEvent.name, {
      id: bookerId,
      email: email,
      password: password,
    });

    return new IdResponse(bookerId);
  }
}
