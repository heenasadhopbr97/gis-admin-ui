export interface netConfCustomer {
  username: string;
  firstname: string;
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
  invoiceType: string;
  parentExperience: string;
  birthDate: Date;
  planMappingList: [
    // Plam drop down multiple plan    planserviceData
    {
      planId: number;
      service: string;
      discount: number;
    },
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
    },
  ];
  paymentDetails: {
    // No need blank
    amount: number;
    paymode: string; //commonListPaymentData dropdown
    referenceno: string;
    paymentdate: string;
  };
  mobile: string;
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
    },
  ];
  custMacMapppingList: [
    {
      macAddress: string;
    },
  ];
  custDocList: [
    {
      filename: any;
      docStatus: any;
      remark: any;
    },
  ];
  salesremark: string;
  servicetype: string;
  serviceareaid: number;
  planPurchaseType: string;
  isDunningEnable: boolean;
  isNotificationEnable: boolean;
  parentQuotaType: string;
  customerLocations: [
    {
      locationId: number;
      mac: string;
      isParentLocation: boolean;
    },
  ];
}
