const { postWithFallback } = require('../bot/utils');
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const dotenv = require('dotenv');

dotenv.config();

jest.mock('input');
jest.mock('telegram');

describe('Telegram Client Initialization and Authentication', () => {
  let client;

  beforeAll(() => {
    input.text = jest.fn();
    TelegramClient.mockImplementation(() => {
      return {
        start: jest.fn(),
        session: {
          save: jest.fn().mockReturnValue('mocked_session_string')
        },
        sendMessage: jest.fn()
      };
    });
  });

  beforeEach(() => {
    client = new TelegramClient(new StringSession('mocked_session_string'), parseInt(process.env.API_ID), process.env.API_HASH, {
      connectionRetries: 5,
    });
  });

  test('should prompt for API credentials and session string', async () => {
    input.text.mockResolvedValueOnce('mocked_api_id')
              .mockResolvedValueOnce('mocked_api_hash')
              .mockResolvedValueOnce('mocked_session_string');

    await require('../index');

    expect(input.text).toHaveBeenCalledWith('Please enter your API ID: ');
    expect(input.text).toHaveBeenCalledWith('Please enter your API Hash: ');
    expect(input.text).toHaveBeenCalledWith('Please enter your session string: ');
  });

  test('should authenticate the client', async () => {
    input.text.mockResolvedValueOnce('mocked_phone_number')
              .mockResolvedValueOnce('mocked_password')
              .mockResolvedValueOnce('mocked_code');

    await client.start({
      phoneNumber: async () => await input.text('Please enter your phone number: '),
      password: async () => await input.text('Please enter your password: '),
      phoneCode: async () => await input.text('Please enter the code you received: '),
      onError: (err) => console.log(err),
    });

    expect(client.start).toHaveBeenCalled();
    expect(input.text).toHaveBeenCalledWith('Please enter your phone number: ');
    expect(input.text).toHaveBeenCalledWith('Please enter your password: ');
    expect(input.text).toHaveBeenCalledWith('Please enter the code you received: ');
  });

  test('should log the session string after connection', async () => {
    console.log = jest.fn();

    await require('../index');

    expect(console.log).toHaveBeenCalledWith('You are now connected.');
    expect(console.log).toHaveBeenCalledWith('Your session string is: ', 'mocked_session_string');
  });

  test('should keep the process running', async () => {
    process.stdin.resume = jest.fn();

    await require('../index');

    expect(process.stdin.resume).toHaveBeenCalled();
  });
});
