import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';
import { HttpResponseCache } from './http-response-cache';

@Injectable({
    providedIn: 'root'
})
export class FultyMacManagementService {

    constructor(private http: HttpClient, private cache: HttpResponseCache
        ,) { }

    getMethod(url:any) {
        return this.http.get(RadiusConstants.KEYANNA_RADIUS_BASE_URL + url);
    }

    postMethod(url:any, data:any) {
        return this.http.post(RadiusConstants.KEYANNA_RADIUS_BASE_URL + url, data);
    }

    deleteMethod(url:any) {
        return this.http.delete(RadiusConstants.KEYANNA_RADIUS_BASE_URL + url);
    }

    updateMethod(url:any, data:any) {
        return this.http.put(RadiusConstants.KEYANNA_RADIUS_BASE_URL + url, data);
    }

    getMethodWithCache(url:any) {
        return this.http.get(RadiusConstants.KEYANNA_RADIUS_BASE_URL + url, {
            params: { from_cache: "true" }, // Return the cached response if available.
        });
    }

    postMethodWithBulkRecord(url:any, data:any) {
        return this.http.post(RadiusConstants.KEYANNA_RADIUS_BASE_URL + url, data);
    }

    clearCache(url:any) {
        if (
            this.cache.hasStored(
                RadiusConstants.KEYANNA_RADIUS_BASE_URL + url + "?from_cache=true"
            )
        ) {
            console.log("Found Cached data >>>>>>>>>>>>>>>>> ");
            this.cache.remove(
                RadiusConstants.KEYANNA_RADIUS_BASE_URL + url + "?from_cache=true"
            );
        }
    }

    getMethodWithCacheFromSales(url:any) {
        return this.http.get(RadiusConstants.KEYANNA_RADIUS_BASE_URL + url, {
            params: { from_cache: "true" }, // Return the cached response if available.
        });
    }
}
