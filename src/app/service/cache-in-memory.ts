import { Injectable } from "@angular/core";
import { HttpRequest, HttpResponse } from "@angular/common/http";

import { HttpResponseCache } from "./http-response-cache";

@Injectable()
class HttpResponseCacheInMemory implements HttpResponseCache {
  private store: { [key: string]: any } = {};
  has(request: HttpRequest<any>) {
    return (
      request.method === "GET" &&
      request.params.get("from_cache") ===
        "true" /* URL parameter necessary to fetch from the cache. */ &&
      !!this.store[request.urlWithParams]
    );
  }
  hasStored(request: string) {
    return !!this.store[request];
  }
  remove(request: string) {
    return delete this.store[request];
  }
  get(request: HttpRequest<any>) {
    return this.store[request.urlWithParams];
  }
  set(request: HttpRequest<any>, key: HttpRequest<any>["urlWithParams"], value: HttpResponse<any>) {
    if (request.params.get("from_cache") === "true") this.store[key] = value;
  }
  clear() {
    this.store = {};
  }
}

// Creating a provider to indicate to Angular which class will be used as the cache.
// The default class registers the cache in memory, but it could register it in localStorage.
export const InMemoryCacheProvider = {
  provide: HttpResponseCache,
  useClass: HttpResponseCacheInMemory,
};
