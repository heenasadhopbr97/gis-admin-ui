import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class TaxManagementService {
  constructor(private http: HttpClient) {}
  taxTypeUrl = "";

  getAllTaxType() {
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJmaXJzdE5hbWVcIjpcImFkbWluXCIsXCJsYXN0TmFtZVwiOlwiYWRtaW5cIixcInVzZXJJZFwiOjEsXCJwYXJ0bmVySWRcIjoxLFwicm9sZXNMaXN0XCI6XCIxXCJ9IiwiZXhwIjoxNjM0NDQ1ODc5fQ.wrn3-gUdbM4NdnFx2MittQie2f17flB5aEoIa5vk7NE`,
    // });
    // return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + '/gettaxtypes', { headers });
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/gettaxtypes");
  }

  addTaxMethod(data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/taxes", data);
  }

  updateTaxMethod(id:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/taxes/" + id, data);
  }

  getData() {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/taxes/all");
  }

  deleteTaxMethod(id:any) {
    return this.http.delete(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/taxes/" + id);
  }

  getTaxDetailById(id:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/taxes/" + id);
  }

  searchTax(data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/taxes/list", data);
  }

  TaxAllData(data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/taxes/list", data);
  }
}
