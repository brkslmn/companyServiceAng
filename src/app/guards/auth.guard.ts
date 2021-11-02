import {Injectable} from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import {Observable} from 'rxjs';
import { ApiService } from '@services/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private jwtHelper: JwtHelperService, private router: Router, private apiService: ApiService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const token = localStorage.getItem("token");
        if (token && !this.jwtHelper.isTokenExpired(token)){
            return this.getProfile();
        }
        this.router.navigate(["login"]);
        return false;
        
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.canActivate(next, state);
    }
    //Path login this part --->
    async getProfile() {
        if (this.apiService.getProfile()) {
            return true;
        }

        try {
            await this.apiService.getProfile();
            return true;
        } catch (error) {
            this.router.navigate(['/login']);
            return false;   
        }
    }
}
