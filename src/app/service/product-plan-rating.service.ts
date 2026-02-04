import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponseCache } from './http-response-cache';
import { ProductPlanRating } from '../components/model/product-plan-rating';
import { Observable } from 'rxjs';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
  providedIn: 'root'
})
export class ProductPlanRatingService {

  constructor(private http: HttpClient,private cache: HttpResponseCache) { }
  
         // Get all Product Plan
      getProductPlans(url: string): Observable<ProductPlanRating[]> {
        return this.http.get<ProductPlanRating[]>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }

        // Get account with pagination (POST method)
      getProductPlansPaginated(url: string, data: any): Observable<any> {
        return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Get Product Plan by ID
      getProductPlansById(url: string): Observable<ProductPlanRating> {
        return this.http.get<ProductPlanRating>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }
    
      // Add new Product Plan
      addProductPlans(url: string, data: any): Observable<any> {
        return this.http.post<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Update Product Plan by ID
      updateProductPlans(url: string, data: any): Observable<any> {
        console.log(url, data);
        return this.http.put<any>(RadiusConstants.RATINGENGINE_IP_PORT + url, data);
      }
    
      // Delete Product Plan by ID
      deleteProductPlans(url: string): Observable<any> {
        return this.http.delete<any>(RadiusConstants.RATINGENGINE_IP_PORT + url);
      }
}
