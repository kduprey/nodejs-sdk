import axios from "axios"
import { readFileSync } from "fs";
import { nanoid } from "nanoid"

const baseURL = 'https://api.byteflow.app'
function wait (milliseconds : number) {
  return new Promise(
      resolve => setTimeout(resolve, milliseconds)
  )
}
const retry = (axios : any, options = {}) => {
  return async function (error : any) {
    if (error.response.status == 420) {
      await wait(error.response.headers['Retry-After'] * 1000) // Convert seconds to milliseconds
      return axios(error.config)
    } else {
      throw error
    }
  }
}

export class ByteFlow {
  private readonly API_KEY: string | undefined = undefined;
  private readonly client : any | undefined = undefined;
  constructor(API_KEY: string) {
    this.API_KEY = API_KEY;
    this.client = axios.create()
    this.client.interceptors.response.use(null, retry(this.client))
  }
  async sendMessage({ message_content, destination_number }: { message_content: string; destination_number: string }) {
    if (this.API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
    await this.client.post(`${baseURL}/sendMessage`, {
      destination_number,
      message_content,
    }, {
      headers: {
        api_key: this.API_KEY,
        "Retry-Id": nanoid()
      },
    });
  }
  async registerNumber({ phone_number }: { phone_number: string; }) {
    if (this.API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
    await this.client.post(`${baseURL}/registerNumber`, {
      phone_number
    }, {
      headers: {
        api_key: this.API_KEY,
      },
    });
  }
  async lookupPhoneNumber({ phone_number, advanced_mode }: { phone_number: string; advanced_mode: boolean | undefined; }) {
    if (this.API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
    const res = await this.client.get(`${baseURL}/lookupNumber?phone_number=${phone_number}${advanced_mode === true ? "&advanced_mode=true" : ""}`, {
      headers: {
        api_key: this.API_KEY,
      },
    });
    return res.data
  }
  async sendMessageWithMedia({ message_content, destination_number, mediaPath }: {
    message_content: string,
    destination_number: string,
    mediaPath: string
  }){
    const preSignedURLRequest = await this.client.post(`${baseURL}/uploadMedia`, {
      filename: mediaPath.substring(mediaPath.lastIndexOf('/')+1),
    }, {
      headers: {
        api_key: this.API_KEY,
      }
    });
    const uploadURL : string = preSignedURLRequest.data.uploadURL;
    const getURL : string = preSignedURLRequest.data.getURL;
    const file = readFileSync(mediaPath);
    await this.client.put(uploadURL, file);
    await this.sendMessage({
      message_content: message_content + " " + getURL,
      destination_number
    })
  }
}
