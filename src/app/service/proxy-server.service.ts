import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class ProxyServerService {
  constructor(private http: HttpClient) {}
  baseUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  getById(serverId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.get(`${this.baseUrl}/proxyserver/${serverId}?mvnoId=${selectedMvnoId}`);
    else return this.http.get(`${this.baseUrl}/proxyserver/${serverId}?mvnoId=${this.mvnoId}`);
  }

  // getAll() {
  //   return this.http.get(
  //     `${this.baseUrl}/proxyserver/all?mvnoId=${this.mvnoId}`
  //   );
  // }

  getAll(page:any, size:any, name:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // return this.http.get(
    //   `${this.baseUrl}/proxyserver/getAllProxyServer?mvnoId=${this.mvnoId}&page=${page}&size=${size}&name=` +
    //     encodeURIComponent(name)
    // );
    if (name) {
      return this.http.get(`${this.baseUrl}/proxyserver/name/` + name + `?mvnoId=${this.mvnoId}`);
    } else {
      return this.http.get(`${this.baseUrl}/proxyserver/all?mvnoId=${this.mvnoId}`);
    }
  }

  findActiveProxyServer() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/proxyserver/findActiveProxyServer` + "?mvnoId=" + this.mvnoId
    );
  }

  delete(serverId: number, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.delete(`${this.baseUrl}/proxyserver/${serverId}?mvnoId=${selectedMvnoId}`);
    else return this.http.delete(`${this.baseUrl}/proxyserver/${serverId}?mvnoId=${this.mvnoId}`);
  }

  getByName(serverName: string, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.get(
        `${this.baseUrl}/proxyserver/name/` +
          encodeURIComponent(serverName) +
          `?mvnoId=${selectedMvnoId}`
      );
    else
      return this.http.get(
        `${this.baseUrl}/proxyserver/name/` +
          encodeURIComponent(serverName) +
          `?mvnoId=${this.mvnoId}`
      );
  }

  add(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.post(`${this.baseUrl}/proxyserver?mvnoId=${data.mvnoId}`, data);
    else return this.http.post(`${this.baseUrl}/proxyserver?mvnoId=${this.mvnoId}`, data);
  }

  update(serverId:any, data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.put(`${this.baseUrl}/proxyserver/${serverId}?mvnoId=${data.mvnoId}`, data);
    else
      return this.http.put(`${this.baseUrl}/proxyserver/${serverId}?mvnoId=${this.mvnoId}`, data);
  }

  changeSatus(id:any, status:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.get(
        `${this.baseUrl}/proxyserver/updateStatus?id=${id}&status=${status}&mvnoId=${selectedMvnoId}` +
          "&lastModifiedBy=" +
          this.loggedInUser
      );
    else
      return this.http.get(
        `${this.baseUrl}/proxyserver/updateStatus?id=${id}&status=${status}&mvnoId=${this.mvnoId}` +
          "&lastModifiedBy=" +
          this.loggedInUser
      );
  }
}
