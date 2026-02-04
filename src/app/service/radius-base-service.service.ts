import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as ReadiusConstant from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
  providedIn: 'root'
})
export class RadiusBaseServiceService {

  constructor(private http: HttpClient) { }

  get(path: string) {
    return this.http.get(ReadiusConstant.KEYANNA_RADIUS_BASE_URL + path);
  }

  delete(path: string) {
    return this.http.delete(ReadiusConstant.KEYANNA_RADIUS_BASE_URL + path);
  }

  post(path: string, data: any) {
    return this.http.post(ReadiusConstant.KEYANNA_RADIUS_BASE_URL + path, data);
  }

  put(path: string, data: any) {
    return this.http.put(ReadiusConstant.KEYANNA_RADIUS_BASE_URL + path, data);
  }

}
