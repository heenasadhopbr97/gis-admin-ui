import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class SystemconfigService {
  constructor(private http: HttpClient) {}

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url, data);
  }

  searchTax(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url, data);
  }

  getConfigurationByName(name:any) {
    return this.http.get(
      RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT +
        `/system/configuration/getConfigurationByName?name=${name}`
    );
  }
}
