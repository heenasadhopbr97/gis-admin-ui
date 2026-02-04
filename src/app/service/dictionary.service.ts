import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class DictionaryService {
  constructor(private http: HttpClient) {}

  baseUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  getVendorTypes() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/dictionary/getVendorType?mvnoId=${this.mvnoId}`);
  }

  findDictionaryById(dictionaryId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/dictionary/findById?mvnoId=${this.mvnoId}&dictionaryId=` + dictionaryId
    );
  }

  findAllDictionary(page:any, size:any, vendor:any, vendorId:any, vendorType:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/dictionary/findAll?mvnoId=${this.mvnoId}` +
        "&page=" +
        page +
        "&size=" +
        size +
        "&vendor=" +
        vendor +
        "&vendorId=" +
        vendorId +
        "&vendorType=" +
        vendorType
    );
  }

  searchDictionary(vendor:any, vendorId:any, vendorType:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/dictionary/searchDictionary?mvnoId=${this.mvnoId}&vendor=` +
        encodeURIComponent(vendor) +
        "&vendorId=" +
        vendorId +
        "&vendorType=" +
        vendorType
    );
  }

  deleteDictionary(dictionaryId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.delete(
        `${this.baseUrl}/dictionary/delete?mvnoId=${selectedMvnoId}&dictionaryId=` + dictionaryId
      );
    else
      return this.http.delete(
        `${this.baseUrl}/dictionary/delete?mvnoId=${this.mvnoId}&dictionaryId=` + dictionaryId
      );
  }

  addDictionary(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.post(`${this.baseUrl}/dictionary/save?mvnoId=${data.mvnoId}`, data);
    else return this.http.post(`${this.baseUrl}/dictionary/save?mvnoId=${this.mvnoId}`, data);
  }

  updateDictionary(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.put(`${this.baseUrl}/dictionary/update?mvnoId=${data.mvnoId}`, data);
    else return this.http.put(`${this.baseUrl}/dictionary/update?mvnoId=${this.mvnoId}`, data);
  }

  //////////////// Dictioanry Attribute web service call ///////////////////////

  getDictionaryAttributes(dictionaryId:any, selectedMvnoId:any, page:any, size:any, name:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/dictionary/attribute/findByDictionaryId?mvnoId=${this.mvnoId}&dictionaryId=` +
        dictionaryId +
        "&page=" +
        page +
        "&size=" +
        size +
        "&name=" +
        name
    );
  }

  findDictionaryAttributeById(dictionaryAttributeId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/dictionary/attribute/findById?mvnoId=${this.mvnoId}&dictionaryAttributeId=` +
        dictionaryAttributeId
    );
  }

  getAttributeCategories() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/dictionary/attribute/getAttributeCategories`);
  }

  addDictionaryAttribute(dictionaryAttributeData:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    console.log("mvid : ", this.mvnoId, dictionaryAttributeData);
    if (this.loggedInUser == "superadmin")
      return this.http.post(
        `${this.baseUrl}/dictionary/attribute/save?mvnoId=${dictionaryAttributeData.mvnoId}`,
        dictionaryAttributeData
      );
    else
      return this.http.post(
        `${this.baseUrl}/dictionary/attribute/save?mvnoId=${this.mvnoId}`,
        dictionaryAttributeData
      );
  }

  updateDictionaryAttribute(dictionaryAttributeData:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.put(
        `${this.baseUrl}/dictionary/attribute/update?mvnoId=${dictionaryAttributeData.mvnoId}`,
        dictionaryAttributeData
      );
    else
      return this.http.put(
        `${this.baseUrl}/dictionary/attribute/update?mvnoId=${this.mvnoId}`,
        dictionaryAttributeData
      );
  }

  deleteDictionaryAttribute(dictionaryAttributeId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.delete(
        `${this.baseUrl}/dictionary/attribute/delete?mvnoId=${selectedMvnoId}&dictionaryAttributeId=` +
          dictionaryAttributeId
      );
    else
      return this.http.delete(
        `${this.baseUrl}/dictionary/attribute/delete?mvnoId=${this.mvnoId}&dictionaryAttributeId=` +
          dictionaryAttributeId
      );
  }

  searchDictionaryAttribute(name:any, dictionaryId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/dictionary/attribute/searchAttribute?mvnoId=${this.mvnoId}&name=` +
        name +
        "&dictionaryId=" +
        dictionaryId
    );
  }

  //////////////// Dictioanry Value web service call ///////////////////////

  getDictionaryValues(dictionaryAttributeId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/dictionary/value/findByAttributeId?mvnoId=${this.mvnoId}&dictionaryAttributeId=` +
        dictionaryAttributeId
    );
  }
  // KeyannaRadius/dictionary/value/findById?dictionaryValueId=2&mvnoId=2
  getDictionaryVal(dictionaryAttributeId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/dictionary/value/findById?dictionaryValueId=` +
        dictionaryAttributeId +
        `&mvnoId=${this.mvnoId}`
    );
  }
  searchDictionaryValues(name:any, value:any, dictionaryAttributeId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/dictionary/value/searchDictionaryValue?mvnoId=${this.mvnoId}&name=` +
        name +
        "&value=" +
        value +
        "&dictionaryAttributeId=" +
        dictionaryAttributeId
    );
  }

  addDictionaryValue(dictionaryValueData:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.post(
        `${this.baseUrl}/dictionary/value/save?mvnoId=${dictionaryValueData.mvnoId}`,
        dictionaryValueData
      );
    else
      return this.http.post(
        `${this.baseUrl}/dictionary/value/save?mvnoId=${this.mvnoId}`,
        dictionaryValueData
      );
  }

  updateDictionaryValue(dictionaryValueData:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.put(
        `${this.baseUrl}/dictionary/value/update?mvnoId=${dictionaryValueData.mvnoId}`,
        dictionaryValueData
      );
    else
      return this.http.put(
        `${this.baseUrl}/dictionary/value/update?mvnoId=${this.mvnoId}`,
        dictionaryValueData
      );
  }

  deleteDictionaryValue(dictionaryValueId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.delete(
        `${this.baseUrl}/dictionary/value/delete?mvnoId=${selectedMvnoId}&dictionaryValueId=` +
          dictionaryValueId
      );
    else
      return this.http.delete(
        `${this.baseUrl}/dictionary/value/delete?mvnoId=${this.mvnoId}&dictionaryValueId=` +
          dictionaryValueId
      );
  }

  findAllAttributes() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/dictionary/attribute/findAll?mvnoId=${this.mvnoId}`);
  }
}
