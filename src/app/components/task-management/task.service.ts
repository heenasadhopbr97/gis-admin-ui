import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { KEYANNA_PROJECT_MANAGEMENT_URL } from 'src/app/RadiusUtils/RadiusConstants';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = KEYANNA_PROJECT_MANAGEMENT_URL;
  private apiUrl = `${this.baseUrl}/task`;

  constructor(private http: HttpClient) {}
  getFlows(): any {
    return this.http.get(`${this.apiUrl}/getAll`);
  }
  deleteFlow(id: number): any {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  changeTaskStatus(id: any, status: any) {
    return this.http.post(
      `${this.apiUrl}/updateTaskStatus?taskId=${id}&status=${status}`,
      ''
    );
  }

  assignTask(data: any) {
    return this.http.post(`${this.apiUrl}/assignTask`, data);
  }

  getAllAssignedTask(id: any) {
    return this.http.get(`${this.apiUrl}/getAll/${id}`);
  }
}
