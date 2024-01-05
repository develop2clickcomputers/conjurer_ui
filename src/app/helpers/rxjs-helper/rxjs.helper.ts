import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

/**
 * RxJs service class helper
 */
@Injectable()
export class RxJSHelper {

  /** Subscription property for component */
  public unSubscribeServices: Subject<void> = new Subject<void>();

  /** Subscription property for modals */
  public unSubscribeModalServices: Subject<void> = new Subject<void>();

  /** @ignore */
  constructor(
  ) { }

}
