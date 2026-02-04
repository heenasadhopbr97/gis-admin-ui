import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponseCache } from './http-response-cache';
import { Observable } from 'rxjs';
import { RateDetailsRating } from '../components/model/rate-details-rating';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
  providedIn: 'root'
})
export class RateDetailsRatingService {

  constructor(private http: HttpClient,private cache: HttpResponseCache) { }
  
         // Get all RateDetails
      getRateDetails(url: string): Observable<RateDetailsRating[]> {
        return this.http.get<RateDetailsRating[]>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }
    
      // Get RateDetails by ID
      getRateDetailsById(url: string): Observable<RateDetailsRating> {
        return this.http.get<RateDetailsRating>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }
    
      // Add new RateDetails
      addRateDetails(url: string, data: any): Observable<any> {
        return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Update RateDetails by ID
      updateRateDetails(url: string, data: any): Observable<any> {
        console.log(url, data);
        return this.http.put<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Delete RateDetails by ID
      deleteRateDetails(url: string): Observable<any> {
        return this.http.delete<any>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }
}
