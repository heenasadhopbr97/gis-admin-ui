import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { KEYANNA_INVENTORY_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
import { HttpResponseCache } from "./http-response-cache";
@Injectable({
  providedIn: "root",
})
export class PopManagementsService {
  baseUrl = KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + "/popmanagement";

  constructor(private http: HttpClient, private cache: HttpResponseCache) {}
  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
  getInventoryMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
  searchPop(page:any, filterData:any) {
    return this.http.post(
      this.baseUrl +
        "/search?page=" +
        page.page +
        "&pageSize=" +
        page.pageSize +
        "&sortBy=id&sortOrder=0",
      filterData
    );
  }
  getMethodWithCache(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, {
      params: { from_cache: "true" }, // Return the cached response if available.
    });
  }
  clearCache(url:any) {
    if (
      this.cache.hasStored(
        RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url + "?from_cache=true"
      )
    ) {
      console.log("Found Cached data >>>>>>>>>>>>>>>>> ");
      this.cache.remove(
        RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url + "?from_cache=true"
      );
    }
  }
}
