import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { KeyannaCommonBaseService } from "./keyanna-common-base.service";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class StaffService extends KeyannaCommonBaseService {
  mvnoId = localStorage.getItem("mvnoId");
  constructor(http: HttpClient) {
    super(http);
  }

  baseUrl: string = "/staffuser";
  staffImg: any;

  getById(staffId:any) {
    // return this.http.get(`${this.baseUrl}/findByStaffId?staffId=` + staffId, { 'headers': headers });
    return this.get(`${this.baseUrl}/` + staffId);
  }

  getByName(staffName:any) {
    return this.get(`${this.baseUrl}/findByName?userName=` + staffName);
  }

  getAll() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(`${this.baseUrl}/findAll?mvnoId=${this.mvnoId}`);
  }

  getAllStaff() {
    return this.get("/staffuser/allActive");
  }

  getAllStaffList(data:any) {
    return this.post("/staffuser/list?product=BSS", data);
  }

  add(data:any) {
    return this.post("/staffuser", data);
  }

  update(data:any, staff_id:any) {
    const update_url = "/staffuser/" + staff_id;
    return this.put(update_url, data);
  }

  delete(staffId:any) {
    const delete_url = "/staffuser/" + staffId;
    return this.deleteData(delete_url);
  }

  changePassword(data:any) {
    return this.put(`${this.baseUrl}/changepassword`, data);
  }

  getAllRoleData(): Observable<any> {
    const get_url = "/role/?productType=BSS";

    return this.get(get_url).pipe(
      map(res => res),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getAllRoleDataForLoggedInUser(): Observable<any> {
    const get_url = "/role/byLoggedInUser/?productType=BSS";
    return this.get(get_url);
  }

  getTeamsData(): Observable<any> {
    const get_url = "/teams/all";
    return this.get(get_url).pipe(
      map(res => res),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  staffSearch(data:any) {
    return this.post("/staffuser/search", data);
  }

  getStaffUserData(id:any) {
    return this.get("/staffuser/" + id);
  }

  getStaff(id:any) {
    return this.get("/getStaffUser/" + id);
  }

  getStaffUserProfile(id:any) {
    return this.get("/staff/profileImage/" + id);
  }
  override postMethod(data:any) {
    return this.post(`/mvno`, data);
  }

  getMethod(url:any) {
    return this.get(url);
  }

  getFromCMS(url:any) {
    return this.getCMS(url);
  }

  postApiMethod(url:any, data:any) {
    return this.post(url, data);
  }

  postApiFromCMS(url:any, data:any) {
    return this.postCMS(url, data);
  }

  getAllBU() {
    return this.get(`/businessUnit/all`);
  }

  addNewReceipt(data:any) {
    return this.post(`/staff/Reciept`, data);
  }

  staffReceiptSearch(receptNumber:any, prefix:any, data:any) {
    return this.postCMS(`/staff/searchbyReciept?recieptNo=${receptNumber}&prefix=${prefix}`, data);
  }

  postcallMethod(url:any, data:any) {
    return this.post(url, data);
  }

  getBUFromStaff() {
    return this.get(`/businessUnit/getBUFromStaff`);
  }

  getAllStaffListWithoutPagination() {
    return this.get("/staffuser/ActivestaffWithoutPaggination");
  }
}
