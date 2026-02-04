export interface PlanGroup {
  // createdById: number,
  // createdByName: string,
  // createdate: string,
  // lastModifiedById: number,
  // lastModifiedByName: string,
  mvnoId: number;
  planGroupId: number;
  planGroupName: string;
  planMappingList: [];
  productPlanGroupMappingList: [];
  serviceAreaId: number;
  status: string;
  planType: string;
}
