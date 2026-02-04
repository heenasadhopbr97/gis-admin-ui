import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient) { }
  authenticate(username:any, password:any) {
    const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) });
    // return this.httpClient.get('http://143.110.244.253:9090/api/v1/validateLogin', { headers })
    return this.httpClient.get('http://143.110.244.253:8090/api/v1/staff/validateLogin', { headers })
      .pipe(
        map(
          userData => {
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('password', password);
            return userData;
          }
        )
      );
  }


  isUserLoggedIn() {
    let user = sessionStorage.getItem('username')
    //console.log(!(user === null))
    return !(user === null)
  }

  logOut() {
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('password')
  }
}
