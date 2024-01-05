import { Component, OnInit } from '@angular/core';

import { AlertService } from '../services/alert.service';

/**
 * Alert component class
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit {

    /** message variable */
    message: any;

    /**
     * Alert component class dependencies
     * @param AlertService alertService
     * [AlertService]{@link AlertService}
     */
    constructor(private alertService: AlertService) { }

    /**
     * To get the message on component load
     */
    ngOnInit() {
        this.alertService.getMessage().subscribe(message => { this.message = message; });
    }
}
