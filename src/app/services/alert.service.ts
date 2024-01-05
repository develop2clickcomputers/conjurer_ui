import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
/* import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject'; */
import { Observable, Subject } from 'rxjs';

/**
 * Alert service class
 */
@Injectable()
export class AlertService {

    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    /**
     * Dependencies
     * @param Router router
     */
    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    /**
     * Success message
     * @param string message
     * @param boolean keepAfterNavigationChange
     */
    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message });
    }

    /**
     * Error message
     * @param string message
     * @param boolean keepAfterNavigationChange
     */
    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: message });
    }

    /**
     * info message
     * @param string message
     * @param boolean keepAfterNavigationChange
     */
    info(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'info', text: message });
    }

    /**
     * Warning message
     * @param string message
     * @param boolean keepAfterNavigationChange
     */
    warn(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'warning', text: message });
    }

    /**
     * To get message
     */
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
