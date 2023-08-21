// tslint:disable-next-line:no-var-requires
const axios = require("axios")
// tslint:disable-next-line:no-var-requires
const throttledQueue = require('throttled-queue');
// tslint:disable-next-line:no-var-requires
const fs = require("fs")

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
      await axios.post('https://api.byteflow.app/sendMessage', {
        destination_number,
        message_content,
      }, {
        headers: {
          api_key: this.#API_KEY,
        },
      });
    });
  }
  async registerNumber({ phone_number }: { phone_number: string; }) {
    if (this.#API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
    throttle(async () => {
      if (this.#API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
      await axios.post('https://api.byteflow.app/registerNumber', {
        phone_number
      }, {
        headers: {
          api_key: this.#API_KEY,
        },
      });
    });
  }
  async lookupPhoneNumber({ phone_number, advanced_mode }: { phone_number: string; advanced_mode: boolean | undefined; }) {
    if (this.#API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
    const res = await axios.get(`https://api.byteflow.app/lookupNumber?phone_number=${phone_number}${advanced_mode === true ? "&advanced_mode=true" : ""}`, {
      headers: {
        api_key: this.#API_KEY,
      },
    });
    return res.data
  }
  async sendMessageWithMedia({ message_content, destination_number, mediaPath }: {
    message_content: string,
    destination_number: string,
    mediaPath: string
  }){
    const preSignedURLRequest = await axios.post('https://api.byteflow.app/uploadMedia', {
      filename: mediaPath.substring(mediaPath.lastIndexOf('/')+1),
    }, {
      headers: {
        api_key: this.#API_KEY,
      }
    });
    const uploadURL : string = preSignedURLRequest.data.uploadURL;
    const getURL : string = preSignedURLRequest.data.getURL;
    const file = fs.readFileSync(mediaPath);
    await axios.put(uploadURL, file);
    await this.sendMessage({
      message_content: message_content + " " + getURL,
      destination_number
    })
  }
}
