import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponseCache } from './http-response-cache';
import { Observable } from 'rxjs';
import { RatePackageRating } from '../components/model/rate-package-rating';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
  providedIn: 'root'
})
export class RatePackageRatingService {

  constructor(private http: HttpClient,private cache: HttpResponseCache) { }
  
         // Get all rate-package
      getRatePackages(url: string): Observable<RatePackageRating[]> {
        return this.http.get<RatePackageRating[]>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }

        // Get rate-package with pagination (POST method)
      getRatePackagesPaginated(url: string, data: any): Observable<any> {
         return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Get rate-package by ID
      getRatePackagesById(url: string): Observable<RatePackageRating> {
        return this.http.get<RatePackageRating>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }
    
      // Add new rate-package
      addRatePackages(url: string, data: any): Observable<any> {
        return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
      
      addRateDetailsPackages(url: string, data: any): Observable<any> {
        return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Update rate-package by ID
      updateRatePackages(url: string, data: any): Observable<any> {
        return this.http.put<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }

      updateRateDetailsPackages(url: string, data: any): Observable<any> {
        return this.http.put<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Delete rate-package by ID
      deleteRatePackages(url: string): Observable<any> {
        return this.http.delete<any>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }

      uploadRateDetailsFile(url: string, formData: FormData): Observable<any> {
        return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, formData);
      }
}
