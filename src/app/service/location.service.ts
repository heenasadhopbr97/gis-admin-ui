import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
@Injectable({
  providedIn: "root"
})
export class LocationService {
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(private http: HttpClient) {}
  baseUrl = RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/LocationMaster";
  commonUrl = RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT;
  getAllLocation(page:any, size:any, name:any) {
    return this.http.get(
      this.baseUrl + `/getAllLocationMaster?` + "page=" + page + "&size=" + size + `&name=${name}`
    );
  }

  getAllActiveLocation() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(this.baseUrl + `/activeLocation`);
  }

  getAllMacByLocation(url:any) {
    return this.http.get(this.baseUrl + `/getMacFromLocations?` + url);
  }

  getLocationByName(name:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(this.baseUrl + `/findLocation?name=` + encodeURIComponent(name));
  }

  getLocationById(id:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(this.baseUrl + `/findLocationMasterById?locationMasterId=${id}`);
  }

  deleteLocation(id:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.delete(this.baseUrl + `/deleteLocation?locationMasterId=${id}`);
    else return this.http.delete(this.baseUrl + `/deleteLocation?locationMasterId=${id}`);
  }

  addNewLocation(data:any) {
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
    if (this.loggedInUser == "superadmin") {
      return this.http.post(this.baseUrl + `/addLocationMaster`, data);
    } else {
      return this.http.post(this.baseUrl + `/addLocationMaster`, data);
    }
  }

  updateLocation(data:any) {
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
    if (this.loggedInUser == "superadmin")
      return this.http.put(this.baseUrl + `/updateLocation?mvnoId=${data.mvnoName}`, data);
    else return this.http.put(this.baseUrl + `/updateLocation`, data);
  }

  changeLocationSatus(name:any, status:any, selectedMvnoId:any) {
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
    if (this.loggedInUser == "superadmin")
      return this.http.get(this.baseUrl + `/updateLocationStatus?name=${name}&status=${status}`);
    else return this.http.get(this.baseUrl + `/updateLocationStatus?name=${name}&status=${status}`);
  }

  getMvnoNameAndIds(url:any) {
    return this.http.get(this.commonUrl + url);
  }
}
