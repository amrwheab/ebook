import { AuthService } from './../services/auth.service';
import { User } from './../shard/user';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainadminGuard implements CanActivate {

  constructor(private authSer: AuthService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    // tslint:disable-next-line: no-non-null-assertion
    const user: User = await this.authSer.getUserFromToken(localStorage.getItem('token')!).toPromise();
    // tslint:disable-next-line: no-non-null-assertion
    if (!user?.mainAdmin) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }

}
