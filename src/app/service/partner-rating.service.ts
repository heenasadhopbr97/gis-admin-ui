import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';
import { HttpResponseCache } from './http-response-cache';
import { PartnerRating } from '../components/model/partners-rating';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerRatingService {

  constructor(private http: HttpClient,private cache: HttpResponseCache) { }


     // Get all partners
  getPartners(url: string): Observable<PartnerRating[]> {
    return this.http.get<PartnerRating[]>(RadiusConstants.RATINGENGINE_IP_PORT + url);
  }

    // Get partners with pagination (POST method)
    getPartnersPaginated(url: string, data: any): Observable<any> {
      return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
    }

  // Get partner by ID
  getPartnerById(url: string): Observable<PartnerRating> {
    return this.http.get<PartnerRating>(RadiusConstants.RATINGENGINE_IP_PORT + url);
  }

  // Add new partner
  addPartner(url: string, data: any): Observable<any> {
    return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
  }

  // Update partner by ID
  updatePartner(url: string, data: any): Observable<any> {
    return this.http.put<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
  }

  // Delete partner by ID
  deletePartner(url: string): Observable<any> {
    return this.http.delete<any>(RadiusConstants.RATINGENGINE_IP_PORT + url);
  }
    
}
