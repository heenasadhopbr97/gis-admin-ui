export interface CustomerToLead {
  leadId: number;
  leadNo: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  title: string;
  pan: string;
  gst: string;
  aadhar: string;
  contactperson: string;
  failcount: number;
  acctno: string;
  custtype: string; //dropdown  ChargeForCustomerData
  phone: string;
  isCustCaf: string;
  plangroupid: any;
  status: any;
  istrialplan: boolean;
  planMappingList: [
    // Plam drop down multiple plan    planserviceData
    {
      planId: number;
      service: string;
      discount: number;
      validity: any;
      istrialplan: boolean;
    }
  ];
  addressList: [
    // Three address comes from country/city/state dropdown
    {
      addressType: string;
      landmark: string;
      areaId: number; //areaData
      pincodeId: number; // allpincodeNumber
      cityId: number; //
      stateId: number;
      countryId: number; //countryData
    }
  ];
  paymentDetails: {
    // No need blank
    amount: number;
    paymode: string; //commonListPaymentData dropdown
    referenceno: string;
    paymentdate: string;
  };
  mobile: any;
  cafno: string;
  voicesrvtype: string;
  didno: string;
  partnerid: number;
  overChargeList: [
    {
      chargeid: number;
      chargetype: string;
      validity: number;
      price: number;
      actualprice: number;
      charge_date: string;
    }
  ];
  custMacMapppingList: [
    {
      macAddress: string;
    }
  ];
  custDocList: [
    {
      filename: any;
      docStatus: any;
      remark: any;
    }
  ];
  salesremark: string;
  servicetype: string;
  serviceareaid: number;
  planPurchaseType: string;
  leadToCustCafFlag: boolean;
  countryCode: any;
  calendarType: any;
}
