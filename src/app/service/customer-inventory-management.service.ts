import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Observable } from "rxjs";
const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
    providedIn: "root",
})
export class CustomerInventoryManagementService {
    constructor(private http: HttpClient) { }

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

    downloadFile(inventoryId:any, uniquename:any): Observable<any> {
        const get_url = RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + "/inwards/inventory/document/download/" + inventoryId + "/" + uniquename;
        return this.http.get(get_url, {
            observe: 'response',
            responseType: 'blob' as 'json',
            headers: httpOptions.headers,
        });
    }
}
