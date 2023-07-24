// tslint:disable-next-line:no-var-requires
const { ofetch } = require('ofetch')
// tslint:disable-next-line:no-var-requires
const throttledQueue = require('throttled-queue');

const throttle = throttledQueue(1, 1000); // at most 1 request per second.

export class ByteFlow {
  #API_KEY: string | undefined = undefined;
  constructor(API_KEY: string) {
    this.#API_KEY = API_KEY;
  }
  async sendMessage({ message_content, destination_number }: { message_content: string; destination_number: string }) {
    if (this.#API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
    throttle(async () => {
      if (this.#API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
      await ofetch('https://api.byteflow.app/sendMessage', {
        method: 'POST',
        headers: {
          api_key: this.#API_KEY,
        },
        body: {
          destination_number,
          message_content,
        },
      });
    });
  }
}
