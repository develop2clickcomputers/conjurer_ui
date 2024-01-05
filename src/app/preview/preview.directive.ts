import { Directive, OnInit, OnDestroy, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
// import {Observable} from 'rxjs/Observable';
// import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';

/** @ignore */
@Directive({
  selector: '[appPreview]'
})
export class PreviewDirective {

  constructor() { }

}

/** @ignore */
@Directive({
    selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

    @Output()
    public clickOutside = new EventEmitter();

    constructor(private _elementRef: ElementRef) {
    }

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(null);
        }
    }
}
