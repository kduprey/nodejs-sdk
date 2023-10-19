export interface ISendMessageResponse {
  sentWithRoute: string | undefined,
  error: string | any[] | undefined
}

export interface IRegisterNumberResponse {
  data: string | undefined,
  error: string | any[] | undefined
}

export interface ILookupPhoneNumber {
  // Basic mode
  is_voip: boolean,
  current_carrier_name: string,
  current_carrier_ocn: string,
  country: {
    name: string,
    dial_code: string,
    emoji: string,
    code: string
  },
  // Advanced Mode
  original_ocn: string | undefined,
  original_carrier_name: string | undefined,
  ported: boolean | undefined,
  is_landline: boolean | undefined,
  is_mobile: boolean | undefined,
  current_imsi: string | undefined,
  current_mcc: string | undefined,
  current_mnc: string | undefined,
}
