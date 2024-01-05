import { Directive, NgModule, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgModel, NgControl } from '@angular/forms';

import { MyCurrencyPipe } from '../../pipes/common/common.pipes';

declare var autocomplete: any;

/**
 * @ignore
 */
@Directive({
  selector: '[appCommon]'
})
export class CommonDirective {

  constructor() { }

}

/**
 * Allow only number
 */
@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {

  /** element */
  @Input() appOnlyNumber: boolean;

  /** @ignore */
  constructor(private el: ElementRef) { }

  /** Key down host listener */
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.appOnlyNumber) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            // event.target.value = event.target.value.replace (/[<>%]/g , '');
            e.preventDefault();
        }
      }
  }
}

/**
 * To restrict special characters
 */
@Directive({
  selector: '[appRestrictSplChar]'
})
export class AppRestrictSpecialCharDirective {

  /** attribute */
  @Input() appRestrictSplChar;

  /** @ignore */
  constructor(private el: ElementRef) { }

  /**
   * Input host listener
   * @param any event
   */
  @HostListener('input', ['$event']) onInput(event: any) {
    event.target.value = event.target.value.replace (/[<>%]/g , '');
  }
}

/**
 * To restrict special characters
 */
@Directive({
  selector: '[appModelRestrictSplChar]',
  providers: [NgModel]
})
export class RestrictSpecialCharacterDirective {

  /** To pass data */
  @Input() appModelRestrictSplChar: any

  /**
   * Dependency
   * @param NgModel ngModel
   */
  constructor(
    private ngModel: NgModel
  ) {}

  /**
   * Modal change host listener
   * @param any event
   */
  @HostListener('ngModelChange', ['$event']) onInputChange(event: any) {
    const newValue = event.replace(/[<>%]/g , '');
    this.ngModel.valueAccessor.writeValue(newValue);
  }
}

/** @ignore */
@Directive({
  selector: '[appAutoComplete]',
  providers: [NgModel]
})
export class AutoCompleteDirective {

  private _el: HTMLElement;
  modelValue: any;

  @Input() appAutoComplete;
  @Input() uiItems

  constructor(private el: ElementRef, private model: NgModel) {
    this._el = el.nativeElement;
    this.modelValue = this.model;
    /* this.el.nativeElement.autocomplete({
      source: this.uiItems,
      max: 10,
      minLength: 3,
      scroll: true,
      select: function () {
        setTimeout(() => {
          this.el.nativeElement.trigger('input');
          this.el.nativeElement.trigger('change');
        }, 500);
      }
    }); */
  }

  @HostListener('input', ['$event']) onInput(event) {
    /* console.log(event);
    console.log(this.uiItems); */
  }
}

/**
 * @ignore
 */
@Directive({
  selector: '[appNgInit]'
})
export class NgInitDirective  implements OnInit {
  @Input() appNgInit;
  ngOnInit() {
      if (this.appNgInit) {
          this.appNgInit();
      }
  }
}

/**
 * To convert to uppercase
 */
@Directive({
  selector: '[appControlUpperCase]',
  providers: [NgModel]
})
export class UpperCaseDirective {

  /**
   * Dependencies
   * @param ElementRef el
   * @param NgControl control
   */
  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  /**
   * Dependencies
   * @param any event
   */
  @HostListener('input', ['$event']) onEvent(event: any) {
    const upper = this.el.nativeElement.value.toUpperCase();
    this.control.control.setValue(upper);
  }
}

/**
 * Number format
 */
@Directive({
  selector: '[appNumberFormatter]',
  providers: [MyCurrencyPipe, NgModel]
})
export class MyCurrencyFormatterDirective implements OnInit {

  /**
   * Input element
   */
  private el: HTMLInputElement;

  /**
   * Dependencies
   * @param ElementRef elementRef
   * @param MyCurrencyPipe currencyPipe
   * @param NgControl control
   */
  constructor(
    private elementRef: ElementRef,
    private currencyPipe: MyCurrencyPipe,
    private control: NgControl
  ) {
    this.el = this.elementRef.nativeElement;
  }

  /** transform input value */
  ngOnInit() {
    if (this.el.value) {
      // this.el.value = this.currencyPipe.transform(this.el.value);
      const reqVal = this.currencyPipe.transform(this.el.value);
      this.control.control.setValue(reqVal);
    }
  }

  /**
   * Keydown host listener
   * @param any event
   */
  @HostListener('keydown', ['$event']) onEvent(event: any) {
    const inputValue = this.el.value;
    let value = this.el.value;
    value = value.replace(/[^0-9\.]/g, '')
    const findsDot = new RegExp(/\./g)
    const containsDot = value.match(findsDot)
    if (containsDot != null && ([46, 110, 190].indexOf(event.which) > -1)) {
      event.preventDefault();
      return false;
    }
    this.control.control.setValue(value);
    if (event.which === 64 || event.which === 16) {
      // numbers
      return false;
    } if ([8, 13, 27, 37, 38, 39, 40, 110].indexOf(event.which) > -1) {
      // backspace, enter, escape, arrows
      return true;
    } else if (event.which >= 48 && event.which <= 57) {
      // numbers
      return true;
    } else if (event.which >= 96 && event.which <= 105) {
      // numpad number
      return true;
    } else if ([46, 110, 190].indexOf(event.which) > -1) {
      // dot and numpad dot
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  /**
   * Focus host listener
   * @param any value
   */
  @HostListener('focus', ['$event.target.value'])
  onFocus(value) {
    if (value) {
      // this.el.value = this.currencyPipe.parse(value); // opossite of transform
      const reqVal = this.currencyPipe.parse(value); // opossite of transform
      this.control.control.setValue(reqVal);
    }
  }

  /**
   * Blur event listener
   * @param any value
   */
  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    if (value) {
      // this.el.value = this.currencyPipe.transform(value);
      const reqVal = this.currencyPipe.transform(value);
      this.control.control.setValue(reqVal);
    }
  }

}

/**
 * Common directive module class
 */
@NgModule({
  imports: [],
  declarations: [
    CommonDirective, OnlyNumberDirective, AppRestrictSpecialCharDirective, UpperCaseDirective,
    AutoCompleteDirective, NgInitDirective, RestrictSpecialCharacterDirective,
    MyCurrencyFormatterDirective
  ],
  exports: [
    CommonDirective, OnlyNumberDirective, AppRestrictSpecialCharDirective, UpperCaseDirective,
    AutoCompleteDirective, NgInitDirective, RestrictSpecialCharacterDirective,
    MyCurrencyFormatterDirective
  ]
})
export class CommonDirectiveModule {  }
