import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../account/account.service';
import { CommonConstant } from '../constants/common/common.constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommonHttpAdapterService } from '../adapters/common-http-adapter.service';
import { CommonNotificationComponent } from '../shared/notification.component';

/**
 * Client adisor component class
 */
@Component({
  selector: 'app-client-advisors',
  templateUrl: './client-advisors.component.html',
  styleUrls: ['./client-advisors.component.css']
})
export class ClientAdvisorsComponent implements OnInit {

  /** Notification component class reference */
  @ViewChild('notificationComponent') notificationComponent: CommonNotificationComponent;

  advisorList: any[] = [];
  advisorObj: any = {};
  clientAdvisorList: any[] = [];
  employeeObj: any = {};
  showEmployeeFlag = false;
  employeeErrorFlag = false;
  showButton = false;
  mappedAdvisor = false;

  showAdvisorList = true;

  /** @ignore */
  constructor(
    private accountService: AccountService,
    private loaderService: Ng4LoadingSpinnerService,
    private commonHttpAdapterService: CommonHttpAdapterService
  ) { }

  /** @ignore */
  ngOnInit() {
    this.getAdvisors();
    this.getClientAdvisors();
  }

  /**
   * To get all registered advisors
   */
  getAdvisors() {
    this.loaderService.show();
    this.accountService.getAdvisors().subscribe(
        res => {
          this.loaderService.hide();
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.showAdvisorList = true;
            this.advisorList = res[CommonConstant.DATA]['advisors'];
          } else {
            console.log(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          this.loaderService.hide();
          console.log(error);
        }
      )
  }

  /**
   * To get client advisors
   */
  getClientAdvisors() {
    this.loaderService.show();
    this.accountService.getAdvisorByUserId().subscribe(
        res => {
          this.loaderService.hide();
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.clientAdvisorList = res[CommonConstant.DATA];
            if (Object.keys(this.advisorObj).length > 0) {
              this.showButtons();
            }
          } else {
            console.log(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          this.loaderService.hide();
        }
      )
  }

  /**
   * To show buttons
   */
  showButtons() {
    this.mappedAdvisor = false;
    this.showButton = false;

    const filteredAdvisor = this.clientAdvisorList.filter((element) => {
      return element.advisorId === this.advisorObj[CommonConstant.PLAIN_ID];
    });
    if (filteredAdvisor.length > 0) {
      this.mappedAdvisor = true;
      this.showButton = filteredAdvisor[0][CommonConstant.PRIMARY];
    }
  }

  /**
   * To display advisor details
   * @param any advisor
   */
  viewAdvisorDetails(advisor) {
    this.advisorObj = advisor;
    const advisorId = advisor[CommonConstant.PLAIN_ID];
    if (!advisorId) {
      return;
    }
    this.showButtons(); // to show buttons based on condition

    let requestData: Object = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    requestData['advisorId'] = advisorId;
    requestData = JSON.stringify(requestData);

    this.loaderService.show();
    this.accountService.getAdvisorById(requestData).subscribe(
      res => {
        this.loaderService.hide();
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.showAdvisorList = false;
          this.showEmployeeFlag = true;
          this.employeeErrorFlag = false;
          const resData = res[CommonConstant.DATA];
          this.employeeObj = resData;
        } else {
          this.employeeErrorFlag = true;
        }
      },
      error => {
        this.loaderService.hide();
        this.employeeErrorFlag = true;
      }
    )
  }

  /** To advisor list */
  backToAdvisorList() {
    this.showAdvisorList = true;
  }

  /**
   * Map advisor with client
   * @param boolean primaryFlag
   */
  mapAdvisor(primaryFlag?: boolean) {

    const filteredAdvisor = this.clientAdvisorList.filter((element) => {
      return element.advisorId === this.advisorObj[CommonConstant.PLAIN_ID];
    });
    if (filteredAdvisor.length > 0) {
      if (filteredAdvisor[0].primary) {
        this.notificationComponent.openNotificationModal('Advisor is already mapped');
        return;
      }
    }

    // else
    let editRequest: any = {};
    editRequest[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    editRequest['advisorId'] = this.advisorObj[CommonConstant.PLAIN_ID];
    editRequest[CommonConstant.ADVISOR_CLIENT_MAP_ID] = '';
    if (primaryFlag) {
      editRequest[CommonConstant.PRIMARY] = true;
    } else {
      editRequest[CommonConstant.PRIMARY] = false;
    }
    editRequest = JSON.stringify(editRequest);

    this.loaderService.show();
    this.accountService.updateClientAdvisor(editRequest).subscribe(
      res => {
        this.loaderService.hide();
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.notificationComponent.openNotificationModal('Advisor updated successfully');
          this.getClientAdvisors(); // refresh client advisors
        } else {
          this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
        }
      },
      error => {
        this.loaderService.hide();
        this.notificationComponent.openNotificationModal('Something went wrong..Please try again later');
      }
    )
  }

}
