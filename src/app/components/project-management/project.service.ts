import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KEYANNA_PROJECT_MANAGEMENT_URL } from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
  providedIn: 'root',
})
export class FlowService {
  private baseUrl = KEYANNA_PROJECT_MANAGEMENT_URL;
  private apiUrl = `${this.baseUrl}`;

  constructor(private http: HttpClient) {}
  getFlows(): any {
    return this.http.get(`${this.apiUrl}/project/getAll`);
  }

  getFlowById(id: number): any {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createFlow(flow: any): any {
    return this.http.post(`${this.apiUrl}/project/create`, flow);
  }

  updateFlow(flow: any): any {
    return this.http.put(`${this.apiUrl}/${flow.id}`, flow);
  }

  deleteFlow(id: number): any {
    return this.http.delete(`${this.apiUrl}/project/delete/${id}`);
  }

  getTree(data: any, type: any) {
    return this.http.get(`${this.apiUrl}/${type}/getAll?status=${data}`);
  }

  getParentHierarchy(payload: { type: string; ids: number[]; status: string }) {
    return this.http.post<any[]>(`${this.apiUrl}/hierarchy/getparent`, payload);
  }

  getChildHierarchy(payload: { type: string; id: number; status: string }) {
    return this.http.post<any[]>(
      `${this.apiUrl}/hierarchy/getchildren`,
      payload
    );
  }
  getAllStaff() {
    return this.http.get(`${this.apiUrl}/staff/getAll`);
  }
  assignProject(data: any) {
    return this.http.post(`${this.apiUrl}/project/assignProject`, data);
  }
  statusChange(id: any, status: any) {
    return this.http.post(
      `${this.apiUrl}/project/updateProjectStatus?projectId=${id}&status=${status}`,
      ''
    );
  }
}
