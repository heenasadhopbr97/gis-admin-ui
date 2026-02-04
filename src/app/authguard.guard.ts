import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './service/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard  {
  constructor(private router: Router, private loginService: LoginService) {
  }

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   console.log("credential", sessionStorage.getItem('username'));
  //   if (sessionStorage.getItem('username') != null && sessionStorage.getItem('username') != undefined) {

  //     return true;
  //   }
  //   else {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  // }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.loginService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }

}
