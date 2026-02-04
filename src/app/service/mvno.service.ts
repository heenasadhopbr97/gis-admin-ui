import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
  providedIn: 'root'
})
export class MvnoService {

  constructor(private http: HttpClient) { }

  
  baseUrl = RadiusConstants.KEYANNA_COMMON_BASE_URL+"/mvno";

  getAllMvnos() {
    return this.http.get(`${this.baseUrl}/findAll`);
  }

  deleteMvno(mvnoId:any) {
    return this.http.delete(`${this.baseUrl}/delete?mvnoId=` + mvnoId);
  }

  findMvnoById(mvnoId:any) {
    return this.http.get(`${this.baseUrl}/findByMvnoId?mvnoId=` + mvnoId)
  }

  addMvno(data:any) {
    return this.http.post(`${this.baseUrl}/save`, data);
  }

  updateLogo(file:any, mvnoId:any) {

    const headers= new HttpHeaders()
    .set('Content-Type', 'multipart/form-data')
    .set('Access-Control-Allow-Origin', '*');

    console.log(`updateLogo service`);
    return this.http.put<any>(`${this.baseUrl}/updateLogo?mvnoId=${mvnoId}` ,file, { 
      headers : headers,
    });
  }

  // addMvno(file, data) {
  //   return this.http.get(`${this.baseUrl}/save?file=${file}&name=${data.name}&organisation=${data.organisation}&password=${data.password}&status=${data.status}`);
  // }

  updateMvno(mvnoData:any) {
    return this.http.put(`${this.baseUrl}/update`, mvnoData)
  }

  findMvno(mvnoName:any) {
    return this.http.get(`${this.baseUrl}/searchByName?name=` + mvnoName)
  }

  updateMvnoStatus(id:any, status:any) {
    return this.http.get(`${this.baseUrl}/updateMvnoStatus?mvnoId=` + id + "&status=" + status);
  }

}
