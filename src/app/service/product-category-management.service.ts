import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KEYANNA_INVENTORY_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Observable } from "rxjs";
const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
@Injectable({
    providedIn: "root",
})
export class ProductCategoryManagementService {
    baseUrl = KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + "/productCategory";
    constructor(private http: HttpClient) { }

    saveDataToServer(data: any) {
        // POST request to save data to the server
        return this.http.post(`${this.baseUrl}`, data);
    }

    getAll(plandata:any) {
        return this.http.post(this.baseUrl, plandata);
    }

    save(data:any) {
        return this.http.post(this.baseUrl + "/save", data);
    }

    update(data:any) {
        return this.http.post(this.baseUrl + "/update", data);
    }

    delete(data:any) {
        return this.http.post(this.baseUrl + "/delete", data);
    }

    searchProduct(page:any, filter:any) {
        // return this.http.post(`${this.baseUrl}/searchProduct`, pageDto);
        return this.http.post(
            `${this.baseUrl}/search?page=` +
            page.page +
            `&pageSize=` +
            page.pageSize +
            `&sortOrder=` +
            0 +
            `&sortBy=id`,
            filter
        );
    }

    getAllActiveProduct() {
        return this.http.get(this.baseUrl + "/getAllActiveProduct");
    }

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

    downloadFile(productId:any): Observable<any> {
        const get_url = RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + "/product/document/download/" + productId;
        return this.http.get(get_url, {
            responseType: "blob",
            headers: httpOptions.headers,
        });
    }

}
