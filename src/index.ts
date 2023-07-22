const { ofetch } = require('ofetch')

export class ByteFlow {
  #API_KEY: string | undefined = undefined;
  constructor(API_KEY: string) {
    this.#API_KEY = API_KEY;
  }
  async sendMessage({ message_content, destination_number }: { message_content: string; destination_number: string }) {
    if (this.#API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
    return await ofetch('https://api.byteflow.app/sendMessage', {
      method: 'POST',
      headers: {
        api_key: this.#API_KEY,
      },
      body: {
        destination_number: destination_number,
        message_content: message_content,
      },
    });
  }
}
