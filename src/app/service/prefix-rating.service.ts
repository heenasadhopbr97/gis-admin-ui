import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponseCache } from './http-response-cache';
import { PrefixRating } from '../components/model/prefix-rating';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrefixRatingService {

  constructor(private http: HttpClient,private cache: HttpResponseCache) { }
  
        // Get all Prefixes
      getPrefixes(url: string): Observable<PrefixRating[]> {
        return this.http.get<PrefixRating[]>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }

        // Get Prefixes with pagination (POST method)
      getPrefixesPaginated(url: string, data: any): Observable<any> {
        return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Get prefix by ID
      getPrefixById(url: string): Observable<PrefixRating> {
        return this.http.get<PrefixRating>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }
    
      // Add new prefix
      addPrefix(url: string, data: any): Observable<any> {
        return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Update prefix by ID
      updatePrefix(url: string, data: any): Observable<any> {
        return this.http.put<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Delete prefix by ID
      deletePrefix(url: string): Observable<any> {
        return this.http.delete<any>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }
}
