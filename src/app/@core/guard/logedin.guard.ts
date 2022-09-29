import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '@core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogedinGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    if (this.auth.loginStatus) {
      return true;
    }
    this.router.navigate(['/']);
  };
}
