import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { LoginService } from "./login.service";
import { finalize } from "rxjs/operators";
const TOKEN_HEADER_KEY = "Authorization";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  COUNT: number = 0;
  constructor(
    private loginService: LoginService,
    private spinner: NgxSpinnerService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();
    req ? this.COUNT++ : "";

    let newRequest = req;
    let token = this.loginService.getToken();
    if (token != null) {
      const headers = new HttpHeaders({
        //   'Authorization': `Bearer ${token}`,
        "Access-Control-Allow-Origin": `*`,
        //     'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE,OPTIONS',
        //     'Content-Type': 'application/json'
        //'requestFrom': 'gui',
        // 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
      });
      if (
        req.url.includes("http://137.184.153.97:40080/KeyannaBillingEngine/postpaidbillingprocess") ||
        req.url.includes("http://137.184.153.97:40080/KeyannaBillingEngine/trialbillingprocess")
      ) {
        newRequest = req.clone();
      }
      // else if (req.url.includes("http://143.244.163.14")) {
      //   // token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJmaXJzdE5hbWVcIjpcImFkbWluXCIsXCJsYXN0TmFtZVwiOlwiYWRtaW5cIixcInVzZXJJZFwiOjEsXCJwYXJ0bmVySWRcIjoxLFwicm9sZXNMaXN0XCI6XCIxXCJ9IiwiZXhwIjoxNjM4MDc2NzQyfQ.id5ewmQeu1B_uIqx71-NCkIh73KwW7wM5G2mlcNyQKY";

      //   //token = localStorage.getItem(token);

      // }
      else {
        token = this.loginService.getToken();
        let userId = localStorage.getItem('userId')
        //newRequest = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token) });
        let header = {
          Authorization: `${token}`,
          requestFrom: `gui`,
          userId : userId
        };
        Object.assign(header, localStorage.getItem("partnerId") === "1" ? {} : { rf: "pw" });
        newRequest = req.clone({
          setHeaders: header,
        });
      }
    }
    //newRequest = newRequest.clone({ setHeaders: { Authorization: `Basic YWRtaW46YWRtaW4xMjM=` } })
    return next.handle(newRequest).pipe(
      finalize(() => {
        this.COUNT--;

        return this.COUNT == 0 ? this.spinner.hide() : this.spinner.show();
      })
    );
  }
}
