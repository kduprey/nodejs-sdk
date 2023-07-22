import { ofetch } from 'ofetch'

export default class ByteFlow {
  constructor(API_KEY) {
    this.API_KEY = API_KEY;
  }
  async sendMessage({ message_content, destination_number }) {
    return await ofetch('https://api.byteflow.app/sendMessage', {
      method: 'POST',
      headers: {
        'api_key': this.API_KEY
      },
      body: JSON.stringify({
        "destination_number": destination_number,
        "message_content": message_content
      }),
    })
  }
}
