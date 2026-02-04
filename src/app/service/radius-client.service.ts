import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class RadiusClientService {
  baseUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;
  baseUrlForNetConf = RadiusConstants.KEYANNA_API_GATEWAY_NETCONF_CUSTOMER;
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(private http: HttpClient) {}

  getClientDataByIp(clientIp:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findClientByIpAddress?mvnoId=${this.mvnoId}&ipAddress=` +
        encodeURIComponent(clientIp)
    );
  }

  getAllCustomerr(page:any, size:any, data:any) {
    return this.http.post(
      `${this.baseUrl}/customers/search?mvnoId=${this.mvnoId}&page=${page}&size=${size}`,
      data
    );
  }

  getAllNetConfCustomer(page:any, size:any, data:any) {
    return this.http.post(
      `${this.baseUrlForNetConf}/customer/customers/search?mvnoId=${this.mvnoId}&page=${page}&size=${size}`,
      data
    );
  }

  getClientDataById(clientId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findClientById?mvnoId=${this.mvnoId}&clientId=` + clientId
    );
  }

  findAllClientData(page:any, size:any, clientIpAddress:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/clients?mvnoId=${this.mvnoId}&page=${page}&size=${size}&clientIpAddress=${clientIpAddress}`
    );
  }

  addNewClient(data:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.post(`${this.baseUrl}/addClient?mvnoId=${selectedMvnoId}`, data);
    else return this.http.post(`${this.baseUrl}/addClient?mvnoId=${this.mvnoId}`, data);
  }

  updateClient(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.put(`${this.baseUrl}/updateClient?mvnoId=${data.mvnoId}`, data);
    else return this.http.put(`${this.baseUrl}/updateClient?mvnoId=${this.mvnoId}`, data);
  }

  deleteClientById(clientId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.delete(
        `${this.baseUrl}/deleteClient?mvnoId=${selectedMvnoId}&clientId=` + clientId
      );
    else
      return this.http.delete(
        `${this.baseUrl}/deleteClient?mvnoId=${this.mvnoId}&clientId=` + clientId
      );
  }

  getAllClientGroups() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/clientGroups?mvnoId=${this.mvnoId}`);
  }

  getAllValidClientGroups() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/validGroups?mvnoId=${this.mvnoId}`);
  }

  getAllIPname() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/ippool/getAll?mvnoId=${this.mvnoId}`);
  }

  getAVailableIPname() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/ippool/getAvailable?mvnoId=${this.mvnoId}`);
  }

  findAllClientList() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/all/clients?mvnoId=${this.mvnoId}`);
  }
}
