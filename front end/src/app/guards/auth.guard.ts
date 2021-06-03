import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  jwt = new JwtHelperService();

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      // tslint:disable-next-line: no-non-null-assertion
      const user = this.jwt.decodeToken(localStorage.getItem('token')!)?.id;
      if (user) {
        this.router.navigate(['/']);
        return false;
      } else {
        return true;
      }
  }

}
