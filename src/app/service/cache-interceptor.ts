import { of } from "rxjs";
import { tap, filter, delay } from "rxjs/operators";
import { Injectable, Provider, InjectionToken } from "@angular/core";
import { HttpInterceptor, HttpRequest } from "@angular/common/http";
import { HttpHandler, HttpResponse, HTTP_INTERCEPTORS, HttpEvent } from "@angular/common/http";

import { HttpResponseCache } from "./http-response-cache";

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cache: HttpResponseCache) {} // Programmed to an interface/abstract class.

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (this.cache.has(request)) {
      return of(this.cache.get(request));
    }
  
    return next.handle(request).pipe(
      filter((event: HttpEvent<any>): event is HttpResponse<any> => event instanceof HttpResponse),
      tap((response) => this.cache.set(request, request.urlWithParams, response))
    );
  }
  
}

export const CacheInterceptorProvider: Provider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: CacheInterceptor,
};
