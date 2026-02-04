import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponseCache } from './http-response-cache';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';
import { Observable } from 'rxjs';
import { PulseRating } from '../components/model/pulse-rating';

@Injectable({
  providedIn: 'root'
})
export class PulseRatingService {

  constructor(private http: HttpClient,private cache: HttpResponseCache) { }
  
         // Get all Pulse
      getPulse(url: string): Observable<PulseRating[]> {
        return this.http.get<PulseRating[]>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }

        // Get pulse with pagination (POST method)
      getPulsePaginated(url: string, data: any): Observable<any> {
         return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Get pulse by ID
      getPulseById(url: string): Observable<PulseRating> {
        return this.http.get<PulseRating>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }
    
      // Add new pulse
      addPulse(url: string, data: any): Observable<any> {
        return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Update pulse by ID
      updatePulse(url: string, data: any): Observable<any> {
        return this.http.put<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Delete pulse by ID
      deletePulse(url: string): Observable<any> {
        return this.http.delete<any>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }
}
