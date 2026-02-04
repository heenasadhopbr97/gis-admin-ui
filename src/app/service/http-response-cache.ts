import { HttpRequest, HttpResponse } from "@angular/common/http";

// Abstração do cache
export abstract class HttpResponseCache {
  abstract has(request: HttpRequest<any>): boolean;
  abstract hasStored(request: string): boolean;
  abstract get(request: HttpRequest<any>): HttpResponse<any>;
  abstract set(
    request: HttpRequest<any>,
    key: HttpRequest<any>["urlWithParams"],
    value: HttpResponse<any>
  ): void;
  abstract remove(request: string): void;
  abstract clear(): void;
}
