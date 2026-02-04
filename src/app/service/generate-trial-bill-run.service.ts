import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
  providedIn: 'root'
})
export class GenerateTrialBillRunService {

  constructor(private http: HttpClient) { }

  searchMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL + url);
  }
}
