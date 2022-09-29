import {Injectable} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '@core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const id = route.params.id;
    if (!this.auth.loginStatus) {
      this.router.navigate(['share/product', id]);
    }
    return true;
  }
}
