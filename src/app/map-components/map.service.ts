import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponseCache } from '../service/http-response-cache';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  permissionList:any[] = [];

  private aclEntrySubject = new BehaviorSubject<any>(null);
  
  // Observable to watch for changes in ACL entries
  aclEntry$ = this.aclEntrySubject.asObservable();

  constructor(private http: HttpClient,private cache: HttpResponseCache,
    private messageService: MessageService
  ) { 
    
   }

  baseUrl = environment.KEYANNA_API_GATEWAY_COMMON_PORT;

  // Method to update ACL entries
  updateAclEntry(aclEntry: any) {
    this.aclEntrySubject.next(aclEntry);
  }

  getMethod(url:any) {
    return this.http.get(this.baseUrl + url);
  }

  public getAclEntry() {
    const url = "/acl/getAclEntry";
    this.permissionList = [];
    this.getMethod(url).subscribe(
      (res: any) => {
        // console.log("res ACL ENTRY ::::::::: ", res);

        if (res.dataList != null) {
          localStorage.setItem("aclEntries", JSON.stringify(res.dataList));
          this.updateAclEntry(JSON.parse(localStorage.getItem("aclEntries")));
        }
      },
      err => {
        this.messageService.add({
          severity: "error",
          summary: err.error.errorMessage,
          detail: "Something was wrong. Try again",
          icon: "far fa-times-circle"
        });
      }
    );
  }
}
