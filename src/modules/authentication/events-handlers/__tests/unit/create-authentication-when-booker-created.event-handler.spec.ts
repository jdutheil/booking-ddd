import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateAuthenticationWhenBookerCreatedEventHandler } from '../../create-authentication-when-booker-created.event-handler';

describe('CreateAuthenticationWhenBookerCreatedEventHandler Unit Tests', () => {
  let handler: CreateAuthenticationWhenBookerCreatedEventHandler;
  let commandBus: CommandBus;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAuthenticationWhenBookerCreatedEventHandler,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateAuthenticationWhenBookerCreatedEventHandler>(
      CreateAuthenticationWhenBookerCreatedEventHandler,
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
