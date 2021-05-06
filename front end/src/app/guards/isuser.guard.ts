import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IsuserGuard implements CanActivate {
  jwt = new JwtHelperService();

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      // tslint:disable-next-line: no-non-null-assertion
      const token = this.jwt.decodeToken(localStorage.getItem('token')!);
      if (token) {
        return true;
      } else {
        return false;
      }
  }

}
