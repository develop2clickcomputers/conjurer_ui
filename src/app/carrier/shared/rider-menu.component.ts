import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Rider menu component class
 */
@Component({
    selector: 'app-rider-menu-temp',
    templateUrl: './rider-menu.component.html',
    styleUrls: ['./carrier-menu.component.css']
})
export class RiderMenuComponent implements OnInit {

    /** To sidable router */
    disableThisUrl = false;

    /** @ignore */
    constructor(
        private router: Router
    ) {}

    /** @ignore */
    ngOnInit() {
        this.disableFutureRoutes();
    }

    /** To disable routes / navigation */
    disableFutureRoutes() {
        const currentUrl = this.router.url;
        if (currentUrl === '/operation/rider/riderinfo' || currentUrl === '/operation/rider/ridercommission') {
            this.disableThisUrl = false;
        } else {
            this.disableThisUrl = true;
        }
    }
}
