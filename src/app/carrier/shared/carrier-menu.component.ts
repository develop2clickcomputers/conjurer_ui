import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Carrier Menu Component Class
 */
@Component({
    selector: 'app-carrier-menu-temp',
    templateUrl: './carrier-menu.component.html',
    styleUrls: ['./carrier-menu.component.css']
})
export class CarrierMenuComponent implements OnInit {

    /** To disable url */
    disableThisUrl = false;

    /** To show 2nd level menu */
    @Input() public showSecondLevelMenu;

    /** @ignore */
    constructor(
        private router: Router
    ) {}

    /** @ignore */
    ngOnInit() {
        this.disableFutureRoutes();
    }

    /**
     * To disable routes
     */
    disableFutureRoutes() {
        const currentUrl = this.router.url;
        if (currentUrl === '/carriers/plan/policy-information' || currentUrl === '/carriers/plan/policy-commission'
            || currentUrl === '/carriers/plan/rider-commission') {
            this.disableThisUrl = false;
        } else {
            this.disableThisUrl = true;
        }
    }
}
