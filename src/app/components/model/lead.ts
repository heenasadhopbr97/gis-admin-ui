export interface Lead {
  id: number;
  leadSourceId: number;
  leadSubSourceId: number;
  leadSourceName: string;
  leadSubSourceName: string;
  rejectReasonId: number;
  rejectSubReasonId: number;
  rejectReasonName: string;
  rejectSubReasonName: string;
  leadAgentId: number;
  leadStaffId: number;
  leadCustomerId: number;
  leadServiceAreaId: number;
  leadBranchId: number;
  leadPartnerId: number;
  leadCategory: string;
  heardAboutSubisuFrom: string;
  leadStatus: string;
  previousVendor: string;
  servicerType: string;
  leadType: string;
  existingCustomerId: number;
  feasibility: string;
  feasibilityRemark: string;
  // planType: string,
  reasonToChangeServiceProvider: string;
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
  department: any;
  leadCustomerType: string;
  isLeadFromCWSC: boolean;
  planMappingList: [
    // Plam drop down multiple plan    planserviceData
    {
      planId: number;
      service: string;
      discount: number;
      isTrialPlan: boolean;
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
      streetName: any;
      houseNo: any;
    }
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
  isDelete: boolean;
  nextApproverId: number;
  approveCurrentLoggedInStaffId: number;
  approveFirstname: string;
  approveMvnoId: number;
  approverNextLeadApprover: number;
  approveServiceareaid: number;
  approveStaffId: number;
  approveStatus: string;
  approveUsername: string;
  customerId: number;
  isCustomerCafeIsUpdated: boolean;
  nextApproveStaffId: number;
  nextTeamMappingId: number;
  assigneeName: string;
  presentCheckForPayment: boolean;
  presentCheckForPermanent: boolean;
  competitorDuration: string;
  expiry: any;
  amount: any;
  gender: string;
  feedback: string;
  dateOfBirth: any;
  previousMonth: any;
  previousAmount: any;
  leadOriginType: any;
  requireServiceType: any;
  landlineNumber: any;
  secondaryPhone: any;
  secondaryEmail: any;
}
