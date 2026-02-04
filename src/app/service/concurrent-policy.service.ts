import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusBaseServiceService } from "./radius-base-service.service";

@Injectable({
  providedIn: "root",
})
export class ConcurrentPolicyService extends RadiusBaseServiceService {
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(http: HttpClient) {
    super(http);
  }

  getConcurrentPolicyByName(policyName:any, page:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `/ConcurrentPolicy/all?mvnoId=${this.mvnoId}&page=${page}&size=${size}&policyName=` +
        encodeURIComponent(policyName)
    );
  }

  getConcurrentPolicyById(concurrentPolicyId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `/ConcurrentPolicy/findById?mvnoId=${this.mvnoId}&concurrentPolicyId=` + concurrentPolicyId
    );
  }

  findAllConcurrentPolicies(page:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(`/ConcurrentPolicy/all?mvnoId=${this.mvnoId}&page=${page}&size=${size}`);
  }

  findAllActiveConcurrentPolicies() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(`/ConcurrentPolicy/validPolicies?mvnoId=${this.mvnoId}`);
  }

  deleteConcurrentPolicyById(concurrentPolicyId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.delete(
        `/ConcurrentPolicy/delete?mvnoId=${selectedMvnoId}&concurrentPolicyId=` + concurrentPolicyId
      );
    else
      return this.delete(
        `/ConcurrentPolicy/delete?mvnoId=${this.mvnoId}&concurrentPolicyId=` + concurrentPolicyId
      );
  }

  addNewConcurrentPolicy(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.post(`/ConcurrentPolicy/save?mvnoId=${data.mvnoName}`, data);
    else return this.post(`/ConcurrentPolicy/save?mvnoId=${this.mvnoId}`, data);
  }

  updateConcurrentPolicy(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    if (this.loggedInUser == "superadmin")
      return this.put(`/ConcurrentPolicy/update?mvnoId=${data.mvnoName}`, data);
    else return this.put(`/ConcurrentPolicy/update?mvnoId=${this.mvnoId}`, data);
  }

  changeConcurrentPolicySatus(concurrentPolicyId:any, status:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    if (this.loggedInUser == "superadmin")
      return this.get(
        `/ConcurrentPolicy/changeStatus?mvnoId=${selectedMvnoId}&concurrentPolicyId=` +
          concurrentPolicyId +
          "&status=" +
          status
      );
    else
      return this.get(
        `/ConcurrentPolicy/changeStatus?mvnoId=${this.mvnoId}&concurrentPolicyId=` +
          concurrentPolicyId +
          "&status=" +
          status
      );
  }
}
