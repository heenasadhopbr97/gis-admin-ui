import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponseCache } from './http-response-cache';
import { RatePackageGroupRating } from '../components/model/rate-package-group-rating';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatePackageGroupRatingService {

  constructor(private http: HttpClient,private cache: HttpResponseCache) { }
  
         // Get all RatePackageGroup
      getRatePackagesGroup(url: string): Observable<RatePackageGroupRating[]> {
        return this.http.get<RatePackageGroupRating[]>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }

        // Get RatePackageGroup with pagination (POST method)
      getRatePackagesPaginated(url: string, data: any): Observable<any> {
        return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Get RatePackageGroup by ID
      getRatePackagesGroupById(url: string): Observable<RatePackageGroupRating> {
        return this.http.get<RatePackageGroupRating>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }
    
      // Add new RatePackageGroup
      addRatePackagesGroup(url: string, data: any): Observable<any> {
        return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Update RatePackageGroup by ID
      updateRatePackagesGroup(url: string, data: any): Observable<any> {
        console.log(url, data);
        return this.http.put<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Delete RatePackageGroup by ID
      deleteRatePackagesGroup(url: string): Observable<any> {
        return this.http.delete<any>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }
}
