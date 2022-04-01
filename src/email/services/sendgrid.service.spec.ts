import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as faker from 'faker';
import { SendgridService } from './sendgrid.service';

jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          statusCode: 200,
          headers: {},
          body: '',
        },
      ]),
    ),
  };
});

describe('SendgridService', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  let sendgridService: SendgridService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '24h' },
        }),
        ConfigModule,
      ],
      providers: [SendgridService],
    }).compile();

    sendgridService = module.get<SendgridService>(SendgridService);
  });

  describe('sendEmail', () => {
    it('should send a email', async () => {
      const spySendEmail = jest.spyOn(sendgridService, 'sendEmail');
      const to = 'example_email@example.com';
      const fakeUuid = faker.datatype.uuid();

      const result = await sendgridService.sendEmail({
        email: to,
        userUuid: fakeUuid,
        objective: 'recover',
      });

      expect(result).toBeUndefined();
      expect(spySendEmail).toBeCalledTimes(1);
    });
  });
});
