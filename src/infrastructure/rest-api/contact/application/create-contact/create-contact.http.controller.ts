import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/routes';
import { JwtAuthenticationGuard } from '@src/infrastructure/rest-api/authentication/infrastructure/security/jwt-authentication.guard';
import { ApiErrorResponse, IdResponse } from '@src/libs/api';
import { EntityID } from '@src/libs/ddd';
import { CreateContactCommand } from '@src/modules/contact/application/commands/create-contact/create-contact.command';
import { ContactEmailAlreadyExistsError } from '@src/modules/contact/domain/contact.errors';
import { ContactEmail } from '@src/modules/contact/domain/value-objects/contact-email';
import { ContactName } from '@src/modules/contact/domain/value-objects/contact-name';
import { None, Option, Result, Some } from 'oxide.ts';
import { CreateContactRequest } from './create-contact.request';

@Controller(routesV1.version)
export class CreateContactHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Create a contact', tags: ['contact'] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ContactEmailAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(JwtAuthenticationGuard)
  @Post(routesV1.contact.root)
  async createContact(
    @Request() req: any,
    @Body() createContactRequest: CreateContactRequest,
  ): Promise<IdResponse> {
    const bookerId = req.user.id;
    if (!bookerId) {
      throw new InternalServerErrorException('Booker ID not found');
    }

    const { firstName, lastName, email, phone } = createContactRequest;

    const contactNameResult = ContactName.create({
      firstName: Option.from(firstName),
      lastName: Option.from(lastName),
    });
    if (contactNameResult.isErr()) {
      throw new BadRequestException(contactNameResult.unwrapErr().message);
    }
    const contactName = Option.from(contactNameResult.unwrap());

    let contactEmail: Option<ContactEmail> = None;
    if (email) {
      const contactEmailResult = ContactEmail.create(email);
      if (contactEmailResult.isErr()) {
        throw new BadRequestException(contactEmailResult.unwrapErr().message);
      }
      contactEmail = Some(contactEmailResult.unwrap());
    }

    const contactPhone = Option.from(phone);

    const command = new CreateContactCommand({
      bookerId,
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
    });
    const result: Result<EntityID, ContactEmailAlreadyExistsError> =
      await this.commandBus.execute(command);

    if (result.isErr()) {
      if (result.unwrapErr() instanceof ContactEmailAlreadyExistsError) {
        throw new ConflictException(result.unwrapErr().message);
      }

      throw new InternalServerErrorException(
        'Unkown error when creating contact',
      );
    }

    return new IdResponse(result.unwrap());
  }
}
