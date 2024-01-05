import { Injectable } from '@angular/core';

/**
 * Logger service class
 */
@Injectable()
export class Logger {

  /** log list */
  logs: string[] = []; // capture logs for testing

  /**
   * To print the log
   * @param string message
   */
  log(message: string) {
    this.logs.push(message);
  }
}
