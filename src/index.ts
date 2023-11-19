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
	private readonly BASE_URL = 'https://api.byteflow.app';
  private readonly API_KEY: string | undefined = undefined;
	private readonly client: AxiosInstance;
  constructor(API_KEY: string) {
    this.API_KEY = API_KEY;
		this.client = axios.create();

		axiosRetry(this.client, {
			retries: 3,
			retryDelay: (retryCount, error) => error.response?.headers['retry-after'] * 1000,
			retryCondition: (error) => {
				if (axiosRetry.isNetworkOrIdempotentRequestError(error)) return true;
				switch (error.response?.status) {
					case 420:
						return true;
					default:
						return false;
				}
			},
		});
	}
	public async sendMessage({ messageContent, destinationNumber }: SendMessageParams): Promise<SendMessageResponse> {
    if (this.API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
    const res = await this.client.post(`${baseURL}/sendMessage`, {
      destination_number,
      message_content,
    }, {
      headers: {
        api_key: this.API_KEY,
	public async registerNumber({ phoneNumber }: RegisterNumberParams): Promise<RegisterNumberResponse> {
    if (this.API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
    const res = await this.client.post(`${baseURL}/registerNumber`, {
      phone_number
    }, {
      headers: {
        api_key: this.API_KEY,
      },
	public async lookupPhoneNumber({ phoneNumber, advancedMode }: LookupPhoneNumberParams): Promise<LookupPhoneNumber> {
    if (this.API_KEY === undefined) throw new Error('API KEY IS NOT DEFINED');
    const res = await this.client.get(`${baseURL}/lookupNumber?phone_number=${phone_number}${advanced_mode === true ? "&advanced_mode=true" : ""}`, {
      headers: {
        api_key: this.API_KEY,
      },
	public async sendMessageWithMedia({
		messageContent,
		destinationNumber,
		mediaPath,
	}: SendMessageWithMediaParams): Promise<SendMessageResponse> {
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
