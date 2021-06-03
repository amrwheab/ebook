import { User } from './../shard/user';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

  constructor(private authSer: AuthService, private router: Router) {}
  user: User | undefined;

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      try {
        // tslint:disable-next-line: no-non-null-assertion
        this.user = await this.authSer.getUserFromToken(localStorage.getItem('token')!).toPromise();
      } catch {
        this.router.navigate(['/']);
        return false;
      }
      // tslint:disable-next-line: no-non-null-assertion
      if (!this.user?.isAdmin) {
        this.router.navigate(['/']);
        return false;
      } else {
        return true;
      }
  }

}
