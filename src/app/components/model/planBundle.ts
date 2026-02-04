export interface PlanBundle {
  agrPercentage: string;
  tdsPercentage: string;
  bookname: string;
  createdById: number;
  createdByName: string;
  createdate: string;
  description: string;
  id: number;
  isDeleted: boolean;
  lastModifiedById: number;
  lastModifiedByName: string;
  noPartnerAssociate: number;
  isAllPlanSelected: boolean;
  revenueSharePercentage: number;
  planGroup: string;

  priceBookPlanDetailList: [
    {
      id: number;
      identityKey: number;
      isDeleted: boolean;
      offerprice: number;
      partnerofficeprice: number;
      revenueSharePercentage: string;
      postpaidPlan: {
        id: number;
      };
      registration: string;
      renewal: string;
      revsharen: string;
      isTaxIncluded: boolean;
    }
  ];
  priceBookSlabDetailsList: [
    {
      commissionAmount: number;
      fromRange: number;
      id: number;
      identityKey: number;
      isDeleted: boolean;
      mvnoId: number;
      toRange: number;
    }
  ];
  status: string;
  updatedate: string;
  validFromString: string;
  validToString: string;
  validfrom: string;
  validto: string;
}
