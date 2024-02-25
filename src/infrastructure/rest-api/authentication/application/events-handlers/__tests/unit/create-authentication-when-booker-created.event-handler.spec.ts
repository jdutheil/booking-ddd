import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateAuthenticationWhenBookerRegisteredEventHandler } from '../../create-authentication-when-booker-registered.event-handler';

describe('CreateAuthenticationWhenBookerCreatedEventHandler Unit Tests', () => {
  let handler: CreateAuthenticationWhenBookerRegisteredEventHandler;
  let commandBus: CommandBus;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAuthenticationWhenBookerRegisteredEventHandler,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateAuthenticationWhenBookerRegisteredEventHandler>(
      CreateAuthenticationWhenBookerRegisteredEventHandler,
    );
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should call command bus with CreateAuthenticationCommand', async () => {
    const event = {
      id: 'booker-id',
      email: 'booker-email@mail.com',
      password: 'booker-password',
    };

    await handler.handle(event);

    // TODO : be more specific !
    expect(commandBus.execute).toHaveBeenCalled();
  });
});
