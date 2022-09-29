import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '@core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoUserGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.loginStatus) {
      this.router.navigate(['home']);
    }
    return true;
  }
}
