import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SellerGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const id = route.params.id;
    let rol;
    this.auth.user$.subscribe(data => rol = data.roles[0].name);
    if (!this.auth.loginStatus && rol !== 'Comprador') {
      this.router.navigate(['share/product', id]);
    }
    return true;
  }
}
