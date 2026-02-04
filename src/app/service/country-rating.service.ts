import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponseCache } from './http-response-cache';
import { Observable } from 'rxjs';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';
import { CountryRating } from '../components/model/country-rating';

@Injectable({
  providedIn: 'root'
})
export class CountryRatingService {

   constructor(private http: HttpClient,private cache: HttpResponseCache) { }

       // Get all country
    getCountry(url: string): Observable<CountryRating[]> {
      return this.http.get<CountryRating[]>(RadiusConstants.RATINGENGINE_IP_PORT + url);
    }

      // Get country with pagination (POST method)
    getCountryPaginated(url: string, data: any): Observable<any> {
      return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
    }
  
    // Get country by ID
    getCountryById(url: string): Observable<CountryRating> {
      return this.http.get<CountryRating>(RadiusConstants.RATINGENGINE_IP_PORT + url);
    }
  
    // Add new country
    addCountry(url: string, data: any): Observable<any> {
      return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
    }
  
    // Update country by ID
    updateCountry(url: string, data: any): Observable<any> {
      return this.http.put<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
    }
  
    // Delete country by ID
    deleteCountry(url: string): Observable<any> {
      return this.http.delete<any>(RadiusConstants.RATINGENGINE_IP_PORT + url);
    }

}
