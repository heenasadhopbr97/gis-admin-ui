import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
    providedIn: 'root'
})
export class TaskSubCategoryService {

    constructor(private http: HttpClient) { }

    getMethod(url:any) {
        return this.http.get(RadiusConstants.KEYANNA_TASK_MANAGEMENT + url);
    }

    postMethod(url:any, data:any) {
        return this.http.post(RadiusConstants.KEYANNA_TASK_MANAGEMENT + url, data);
    }

    deleteMethod(url:any) {
        return this.http.delete(RadiusConstants.KEYANNA_TASK_MANAGEMENT + url);
    }

    updateMethod(url:any, data:any) {
        return this.http.put(RadiusConstants.KEYANNA_TASK_MANAGEMENT + url, data);
    }
}
