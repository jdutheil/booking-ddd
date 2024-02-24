import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/routes';
import { ApiErrorResponse, IdResponse } from '@src/libs/api';
import { AggregateID } from '@src/libs/ddd';
import { Result, match } from 'oxide.ts';
import { BookerAlreadyExistsError } from '../../domain/booker.errors';
import { CreateBookerCommand } from './create-booker.command';
import { CreateBookerRequestDto } from './create-booker.request.dto';

@Controller(routesV1.version)
export class CreateBookerHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Create a booker', tags: ['booker'] })
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
    @Body() createBookerDto: CreateBookerRequestDto,
  ): Promise<IdResponse> {
    const command = new CreateBookerCommand(createBookerDto);
    const result: Result<AggregateID, BookerAlreadyExistsError> =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error: Error) => {
        if (error instanceof BookerAlreadyExistsError) {
          throw new ConflictException(error.message);
        }
        throw error;
      },
    });
  }
}
