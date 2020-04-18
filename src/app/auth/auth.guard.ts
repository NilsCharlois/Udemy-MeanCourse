import { CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate{
  /**
   *
   */
  constructor(private authService: AuthService,
    private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot):
  boolean | Promise<boolean> | Observable<boolean> {
    const isAuth = this.authService.getIsAuthenticated()
    if(isAuth){
      return true;
    }
    this.router.navigate(['/login']);
  }

}
