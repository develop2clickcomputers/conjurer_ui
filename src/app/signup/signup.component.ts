import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SignupService } from './signup.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  // styleUrls: ['./signup.component.css'],
  providers: [SignupService, AlertService]
})
export class SignupComponent implements OnInit {

  /** user object */
  user: any = {};

  /** To show loader */
  dataLoading: boolean;

  /** @ignore */
  constructor(
    private router: Router,
    private signupService: SignupService,
    private alertService: AlertService
  ) { }

  /** @ignore */
  ngOnInit() {
  }

  /**
   * To signup
   */
  signup() {

    if (this.user) {
      this.signupService.signup(this.user).subscribe(
        data => {
          console.log('registred');
        },
        error => {
          console.log('error happedned');
          this.alertService.error('Something went worng');
        }
      )
    }
  }

}
