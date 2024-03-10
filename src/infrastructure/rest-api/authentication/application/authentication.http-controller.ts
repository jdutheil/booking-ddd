import { WebhookEvent } from '@clerk/clerk-sdk-node';
import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/routes';
import { EntityID } from '@src/libs/ddd';
import { RegisterBookerCommand } from '@src/modules/booker/application/commands/register-booker/register-booker.command';
import { BookerAlreadyExistsError } from '@src/modules/booker/domain/booker.errors';
import { BookerEmail } from '@src/modules/booker/domain/value-objects/booker-email';
import { Request } from 'express';
import { Result } from 'oxide.ts';
import { Webhook } from 'svix';
import { AuthenticationError } from '../domain/authentication.errors';
import { Public } from '../infrastructure/security/is-public';
import { CreateAuthenticationCommand } from './commands/create-authentication/create-authentication.command';

@Controller(`${routesV1.version}/${routesV1.auth.root}`)
@ApiTags('Authentication')
export class AuthenticationHttpController {
  private logger: Logger = new Logger(AuthenticationHttpController.name);

  constructor(
    private configService: ConfigService,
    private commandBus: CommandBus,
    private eventEmitter: EventEmitter2,
  ) {}

  @Public()
  @Post('user-created-webhook')
  async userCreatedWebhook(@Req() req: RawBodyRequest<Request>): Promise<void> {
    this.logger.log('Received event on user-created-webhook');

    const webhookSecret = this.configService.get('USER_CREATED_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new AuthenticationError('Webhook secret not found');
    }

    const headers = req.headers;
    const payload = req.rawBody!.toString('utf8');

    // Get the Svix headers for verification
    const svix_id = headers['svix-id'] as string;
    const svix_timestamp = headers['svix-timestamp'] as string;
    const svix_signature = headers['svix-signature'] as string;

    // If there are missing Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('missing svix headers');
      throw new BadRequestException('Missing Svix headers');
    }

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }

    const { id } = evt.data;
    const eventType = evt.type;

    this.logger.log(`Webhook with an ID of ${id} and type of ${eventType}`);

    if (eventType === 'user.created') {
      const { id: userId } = evt.data;
      const email = evt.data.email_addresses[0].email_address;

      if (!userId) {
        throw new BadRequestException('User ID not found in the event');
      }

      if (!email) {
        throw new BadRequestException('Email not found in the event');
      }

      // Register booker
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
          throw new BadRequestException(result.unwrapErr().message);
        }

        throw new InternalServerErrorException('Failed to register booker');
      }

      const bookerId = result.unwrap();

      // Create Authentication
      const authenticationCommand = new CreateAuthenticationCommand({
        bookerId: bookerId,
        userId: userId,
      });
      const authenticationResult: Result<EntityID, AuthenticationError> =
        await this.commandBus.execute(authenticationCommand);

      if (authenticationResult.isErr()) {
        throw new InternalServerErrorException(
          'Failed to create authentication',
        );
      }
    }
  }

  @Get('test-auth')
  async test(@Req() req: any): Promise<string> {
    const userId = req.auth.userId;
    console.log('userId', userId);

    return 'You are authenticated';
  }
}
