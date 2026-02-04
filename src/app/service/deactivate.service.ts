// import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
// import { type } from "os";
import { Observable } from "rxjs/internal/Observable";
// @Injectable({
//   providedIn: 'root'
// })

export interface IDeactivateGuard {
  canExit: () => boolean | Promise<boolean> | Observable<boolean>;
}

export class DeactivateService  {
  private shouldCheckCanExit: boolean = true;

  setShouldCheckCanExit(shouldCheck: boolean) {
    this.shouldCheckCanExit = shouldCheck;
  }

  canDeactivate(
    component: IDeactivateGuard,
    route: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.shouldCheckCanExit) {
      return component.canExit();
    } else {
      this.shouldCheckCanExit = true;
      return true;
    }
  }
}
