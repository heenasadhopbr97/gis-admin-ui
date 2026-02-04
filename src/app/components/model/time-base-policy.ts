export interface TimeBasePolicy {
  buId:number,
  createdById:number,
  createdByName: string,
  createdate: string,
  id:number,
  identityKey:number,
  isDeleted: boolean,
  lastModifiedById:number,
  lastModifiedByName: string,
  mvnoId:number,
  name: string,
  status: string,
  timeBasePolicyDetailsList: [
    {
      access: boolean,
      buId: number,
      detailsid: number,
      fromDay: string,
      fromTime: string,
      identityKey: number,
      isDeleted: boolean,
      mvnoId: number,
      speed: string,
      toDay: string,
      toTime: string
    }
  ],
  updatedate: string
}
