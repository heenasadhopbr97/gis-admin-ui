import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) { }

  search(query: string) {
    return this.http.get<any[]>(`${this.nominatimUrl}?format=json&q=${encodeURIComponent(query)}`);
  }
}
