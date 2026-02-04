import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RadiusBaseServiceService } from "./radius-base-service.service";

@Injectable({
  providedIn: "root",
})
export class ClientGroupService extends RadiusBaseServiceService {
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(http: HttpClient) {
    super(http);
  }

  getClientGroupDataByName(groupName:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `/findClientGroupByName?mvnoId=${this.mvnoId}&name=` + encodeURIComponent(groupName)
    );
  }

  getClientGroupDataById(groupId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(`/findClientGroupById?mvnoId=${this.mvnoId}&clientGroupId=` + groupId);
  }

  findAllClientGroupData(page:any, size:any, name:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `/findClientGroupByName?mvnoId=${this.mvnoId}&name=${name}&page=${page}&size=${size}`
    );
  }

  findAllClientData(page:any, size:any, clientIpAddress:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `/clients?mvnoId=${this.mvnoId}&page=${page}&size=${size}&clientIpAddress=${clientIpAddress}`
    );
  }

  deleteClientGroupById(groupId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.delete(`/deleteClientGroup?mvnoId=${selectedMvnoId}&clientGroupId=` + groupId);
    else return this.delete(`/deleteClientGroup?mvnoId=${this.mvnoId}&clientGroupId=` + groupId);
  }

  addNewClientGroup(data:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.post(`/addClientGroup?mvnoId=${selectedMvnoId}`, data);
    else return this.post(`/addClientGroup?mvnoId=${this.mvnoId}`, data);
  }

  updateClientGroup(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.put(`/updateClientGroup?mvnoId=${data.mvnoId}`, data);
    else return this.put(`/updateClientGroup?mvnoId=${this.mvnoId}`, data);
  }

  changeClientGroupSatus(groupId:any, status:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.get(
        `/updateClientGroupStatus?mvnoId=${selectedMvnoId}&clientGroupId=` +
          groupId +
          "&status=" +
          status
      );
    else
      return this.get(
        `/updateClientGroupStatus?mvnoId=${this.mvnoId}&clientGroupId=` +
          groupId +
          "&status=" +
          status
      );
  }

  deleteClientReplyById(attributeId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.delete(
        `/deleteCustomerReply?mvnoId=${selectedMvnoId}&attributeId=` + attributeId
      );
    else
      return this.delete(`/deleteCustomerReply?mvnoId=${this.mvnoId}&attributeId=` + attributeId);
  }

  getClientAttributes(groupId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(`/clientReplyByClientGroupId?clientGroupId=${groupId}&mvnoId=${this.mvnoId}`);
  }
  validGroups(mvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(`/coaDMProfiles?mvnoId=${this.mvnoId}`);
  }

  reloadCache() {
    console.log("Reload Cache..!");
    return this.get(`/reloadCache`);
  }
}
