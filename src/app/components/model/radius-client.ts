export interface IClient {
  clientId: number;
  clientIpAddress: any;
  sharedKey: any;
  timeOut: any;
  ipType: any;
  clientGroupId: number;
  mvnoId: any;
  clientGroupMappings: ClientGroupMappings[];
  ipPoolMappingList: IPPoolMappings[];
}

export interface ClientGroupMappings {
  clientGroupEntryId: number;
  clientGroupId: any;
  clientId: any;
  checkItem: any;
  priority: any;
}

export interface IPPoolMappings {
  ipPoolMappingId: number;
  clientId: any;
  ipPoolId: any;
}
