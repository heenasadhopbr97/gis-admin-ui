import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class RadiusIpService {
  mvnoId = localStorage.getItem("mvnoId");
  baseUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;

  constructor(private http: HttpClient) {}

  postMethod(url:any, data:any) {
    return this.http.post(this.baseUrl + url, data);
  }

  getMethod(url:any, data:any) {
    return this.http.get(this.baseUrl + url, data);
  }

  findIpPoolById(url:any) {
    return this.http.get(this.baseUrl + url);
  }

  getIpData(poolId: number, ipAddress: string, size: number, page: number) {
    const mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/ippool/allocation/search?mvnoId=${mvnoId}&poolId=${poolId}&size=${size}&page=${page}`
    );
  }

  searchByIp(poolId:any, ipAddress:any, size:any, page:any) {
    const mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/ippool/allocation/getByIp?mvnoId=${mvnoId}&poolId=${poolId}&ipAddress=${ipAddress}&size=${size}&page=${page}`
    );
  }
}
