import { WebhookEvent } from '@clerk/clerk-sdk-node';
import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/routes';
import { Request } from 'express';
import { Webhook } from 'svix';
import { AuthenticationError } from '../domain/authentication.errors';
import { Public } from '../infrastructure/security/is-public';

@Controller(`${routesV1.version}/${routesV1.auth.root}`)
@ApiTags('Authentication')
export class AuthenticationHttpController {
  private logger: Logger = new Logger(AuthenticationHttpController.name);

  constructor(private configService: ConfigService) {}

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
      const { id } = evt.data;
    }
  }

  @Get('test-auth')
  async test(@Req() req: any): Promise<string> {
    const userId = req.auth.userId;
    console.log('userId', userId);

    return 'You are authenticated';
  }
}
