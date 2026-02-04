import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DBMappingMasterService {
  baseUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(private http: HttpClient) {}
  getDBMasterMappingByName(name:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findDbMappingMastersByName?mvnoId=${this.mvnoId}&name=` +
        encodeURIComponent(name)
    );
  }

  findDbMappingMastersById(dbMapingMastersId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findDbMapingMastersById?mvnoId=${this.mvnoId}&dbMapingMastersId=` +
        dbMapingMastersId
    );
  }

  findAllDBMappingMasters(page:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/dbMapingMasters?mvnoId=${this.mvnoId}&page=${page}&size=${size}`
    );
  }

  findAllActiveDBMappingMasters() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/validMappings?mvnoId=${this.mvnoId}`);
  }

  addNewDbMappingMaster(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.post(`${this.baseUrl}/addDbMapingMaster?mvnoId=${data.mvnoName}`, data);
    else return this.http.post(`${this.baseUrl}/addDbMapingMaster?mvnoId=${this.mvnoId}`, data);
  }

  updateDbMappingMaster(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.put(`${this.baseUrl}/updateDbMapingMaster?mvnoId=${data.mvnoName}`, data);
    else return this.http.put(`${this.baseUrl}/updateDbMapingMaster?mvnoId=${this.mvnoId}`, data);
  }

  deleteDbMappingMasterById(dbMapingMasterId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.delete(
        `${this.baseUrl}/deleteDbMappingMasterById?mvnoId=${selectedMvnoId}&dbMappingMasterId=` +
          dbMapingMasterId
      );
    else
      return this.http.delete(
        `${this.baseUrl}/deleteDbMappingMasterById?mvnoId=${this.mvnoId}&dbMappingMasterId=` +
          dbMapingMasterId
      );
  }

  deleteDBMapping(dbMappingId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.delete(
        `${this.baseUrl}/deleteDBMapping?mvnoId=${selectedMvnoId}&dbMappingId=` + dbMappingId
      );
    else
      return this.http.delete(
        `${this.baseUrl}/deleteDBMapping?mvnoId=${this.mvnoId}&dbMappingId=` + dbMappingId
      );
  }

  findDBMappingByDBMappingMasterId(dbMappingMasterId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findDBMappingByDBMappingMasterId?mvnoId=${this.mvnoId}&dbMappingMasterId=` +
        dbMappingMasterId
    );
  }

  updateDBMapping(data:any, mappingMasterId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.put(
        `${this.baseUrl}/updateDBMapping?mvnoId=${selectedMvnoId}&mappingMasterId=${mappingMasterId}`,
        data
      );
    else
      return this.http.put(
        `${this.baseUrl}/updateDBMapping?mvnoId=${this.mvnoId}&mappingMasterId=${mappingMasterId}`,
        data
      );
  }

  searchMappingMasters(name:any, page:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/dbMapingMasters?mvnoId=${this.mvnoId}&page=${page}&size=${size}&name=` + name
    );
  }
  changeDBMappingMasterStatus(dbMappingMasterId:any, status:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.get(
        `${this.baseUrl}/changeDBMappingMasterStatus?mvnoId=${selectedMvnoId}&dbMappingMasterId=` +
          dbMappingMasterId +
          "&status=" +
          status
      );
    else
      return this.http.get(
        `${this.baseUrl}/changeDBMappingMasterStatus?mvnoId=${this.mvnoId}&dbMappingMasterId=` +
          dbMappingMasterId +
          "&status=" +
          status
      );
  }
}
