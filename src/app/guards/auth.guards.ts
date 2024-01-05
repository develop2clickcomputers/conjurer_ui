import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild,
        ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/**
 * Auth gurad class
 */
@Injectable()
export class AuthGuard implements CanActivate {

    /**
     * Dependencies
     * @param Router router
     */
    constructor(private router: Router) { }

    /**
     * To check if user alrady logged in
     *
     * To protect parent routes
     * @param ActivatedRouteSnapshot route
     * @param RouterStateSnapshot state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (sessionStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }

    /**
     * To protect child routes
     * @param ActivatedRouteSnapshot route
     * @param RouterStateSnapshot state
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    /**
     * @ignore
     * @param string url
     */
    checkLogin(url: string): boolean {
        // if (this.authService.isLoggedIn) { return true; }

        // Store the attempted URL for redirecting
        // this.authService.redirectUrl = url;

        // Navigate to the login page
        this.router.navigate(['/login']);
        return false;
    }
}
