import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponseCache } from './http-response-cache';
import { AccountsRating } from '../components/model/accounts-rating';
import { Observable } from 'rxjs';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
  providedIn: 'root'
})
export class AccountsRatingService {


    constructor(private http: HttpClient,private cache: HttpResponseCache) { }
    
           // Get all account
        getAccounts(url: string): Observable<AccountsRating[]> {
          return this.http.get<AccountsRating[]>(RadiusConstants.RATINGENGINE_IP_PORT + url);
        }

          // Get account with pagination (POST method)
        getAccountsPaginated(url: string, data: any): Observable<any> {
          return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
        }
      
        // Get account by ID
        getAccountsById(url: string): Observable<AccountsRating> {
          return this.http.get<AccountsRating>(RadiusConstants.RATINGENGINE_IP_PORT + url);
        }
      
        // Add new account
        addAccounts(url: string, data: any): Observable<any> {
          return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
        }
      
        // Update account by ID
        updateAccounts(url: string, data: any): Observable<any> {
          return this.http.put<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
        }
      
        // Delete account by ID
        deleteAccounts(url: string): Observable<any> {
          return this.http.delete<any>(RadiusConstants.RATINGENGINE_IP_PORT + url);
        }

        getAccountsByPartner(url: string): Observable<AccountsRating[]> {
          return this.http.get<AccountsRating[]>(RadiusConstants.RATINGENGINE_IP_PORT + url);
        }
    
}
