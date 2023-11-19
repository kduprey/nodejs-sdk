import { readFileSync } from 'node:fs';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { nanoid } from 'nanoid';
import axiosRetry from 'axios-retry';
import type {
	SendMessageResponse,
	RegisterNumberResponse,
	LookupPhoneNumber,
	SendMessageWithMediaParams,
	LookupPhoneNumberParams,
	RegisterNumberParams,
	SendMessageParams,
} from './types';

export * from './types';
export class ByteFlow {
  private readonly API_KEY: string | undefined = undefined;
  private readonly client: any | undefined = undefined;
  constructor(API_KEY: string) {
    this.API_KEY = API_KEY;
    this.client = axios.create()
    this.client.interceptors.response.use(null, retry(this.client))
  }
  async sendMessage({ message_content, destination_number }: { message_content: string; destination_number: string }): Promise<ISendMessageResponse> {
    if (this.API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
    const res = await this.client.post(`${baseURL}/sendMessage`, {
      destination_number,
      message_content,
    }, {
      headers: {
        api_key: this.API_KEY,
        "Retry-Id": nanoid()
      },
    });
    return res
  }
  async registerNumber({ phone_number }: { phone_number: string; }): Promise<IRegisterNumberResponse> {
    if (this.API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
    const res = await this.client.post(`${baseURL}/registerNumber`, {
      phone_number
    }, {
      headers: {
        api_key: this.API_KEY,
      },
    });
    return res
  }
  async lookupPhoneNumber({ phone_number, advanced_mode }: { phone_number: string; advanced_mode: boolean | undefined; }): Promise<ILookupPhoneNumber> {
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
  }): Promise<ISendMessageResponse> {
    const preSignedURLRequest = await this.client.post(`${baseURL}/uploadMedia`, {
      filename: mediaPath.substring(mediaPath.lastIndexOf('/') + 1),
    }, {
      headers: {
        api_key: this.API_KEY,
      }
    });
    const uploadURL: string = preSignedURLRequest.data.uploadURL;
    const getURL: string = preSignedURLRequest.data.getURL;
    const file = readFileSync(mediaPath);
    await this.client.put(uploadURL, file);
    const res = await this.sendMessage({
      message_content: message_content + " " + getURL,
      destination_number
    })
    return res
  }
}
