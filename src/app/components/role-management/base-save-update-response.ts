export class ResponseData<T> {
  data: T;
  dataList: Array<T>;
  totalRecords: number;
  requestToken: string;
  responseMessage: string;
  responseCode: number;
  constructor() {}
}
