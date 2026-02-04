import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { KEYANNA_COMMON_BASE_URL } from '../RadiusUtils/RadiusConstants';
import {
  KEYANNA_API_GATEWAY_COMMON_MANAGEMENT,
  KEYANNA_COMMON_BASE_URL,
} from "../RadiusUtils/RadiusConstants";
@Injectable({
  providedIn: "root",
})
export class KeyannaCommonBaseService {
  constructor(private http: HttpClient) {}

  get(path: string) {
    return this.http.get(KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + path);
  }

  deleteData(path: string) {
    return this.http.delete(KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + path);
  }

  post(path: string, data: any) {
    return this.http.post(KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + path, data);
  }
  postCMS(path: string, data: any) {
    return this.http.post(KEYANNA_COMMON_BASE_URL + path, data);
  }

  put(path: string, data: any) {
    return this.http.put(KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + path, data);
  }
  getCMS(path: string) {
    return this.http.get(KEYANNA_COMMON_BASE_URL + path);
  }

  postMethod(url:any, data:any) {
    return this.http.post(KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url, data);
  }

  getConnection(url:any) {
    return this.http.get(KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url);
  }
}
