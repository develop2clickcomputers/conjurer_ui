import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../shared/common/modal.config';

/** Jquery Integration */
declare var $: any;
import * as Chart from 'chart.js';

import { CommonConstant } from '../constants/common/common.constant';
import { AccountService } from '../account/account.service';
import { CommonHttpAdapterService } from '../adapters/common-http-adapter.service';
import { CommonNotificationComponent } from '../shared/notification.component';
import { CommonService } from '../services/common/common.service';
import { AccountHelper } from '../helpers/account/account.helper';
import { CommonHelperService } from '../helpers/common/common.helper';
import { CustomOutputComponent } from '../custom-output/custom-output.component';

/**
 * After login header component
 */
@Component({
    selector: 'app-authorised-header',
    templateUrl: './authorised-header.html',
    // styleUrls: ['./authorise-header.css'],
    providers: [
        AccountService, CommonService, CommonHttpAdapterService,
        CommonHelperService, RxJSHelper
    ]
})

export class AuthorisedHeaderComponent implements OnInit, AfterViewInit {

    /** Notification component reference */
    @ViewChild('notificationComponent', {static: false}) notificationComponent: CommonNotificationComponent;

    /** MFA modal reference */
    @ViewChild('mfaModal', {static: false}) mfaModal: TemplateRef<any>;

    /** Setting modal reference */
    @ViewChild('settingModal', {static: false}) settingModal: TemplateRef<any>;

    /** Custom modal reference */
    @ViewChild('customOutputComponent', {static: false}) customOutputComponent: CustomOutputComponent;

    @Output() callBackOnAccountAdded: EventEmitter<any> = new EventEmitter();

    public currentRefresh: any = {};
    showAccounts: boolean;
    refreshStatus: any;
    loading: boolean;
    showMFABox: boolean;
    isRefreshing: boolean;
    InstitutionNameInAction: any;

    notificationMessage: string;
    checkRefreshIntervalId1: any;
    checkRefreshIntervalId: any;
    start_count = 0;

    public changeCredentialForm: FormGroup;
    public mfaModalRef: BsModalRef;
    public settingModalRef: BsModalRef;

    public username: any = '';
    public changePasswordDataLoading = false;

    /** @ignore */
    constructor(
        private _fb: FormBuilder,
        private router: Router,
        private accountService: AccountService,
        private commonHttpAdapterService: CommonHttpAdapterService,
        private accountHelper: AccountHelper,
        private modalService: BsModalService,
        private modalConfig: ModalConfig,
        private commonService: CommonService,
        private commonHelperService: CommonHelperService,
        private rxjsHelper: RxJSHelper
    ) { }

    /** @ignore */
    ngOnInit() {
        this.showUserName();
        // console.log(this.currentRefresh);
        this.validateInputFields();
        if (this.currentRefresh && Object.keys(this.currentRefresh).length > 0) {
            this.refreshStatus = this.currentRefresh.refreshStatus;
        }
        this.checkCurrentRefreshData();
        this.registerChartJsService();
    }

    /** @ignore */
    ngAfterViewInit() {
        $('.dropdown-submenu a.manage-account').on('mouseover', function (e) {
            $(this).next('ul').toggle();
            e.stopPropagation();
            e.preventDefault();
        });

        // to hide subdropdown
        $('.dropdown-submenu .dropdown-menu').on('mouseleave', function (e) {
            $(this).hide();
            e.stopPropagation();
            e.preventDefault();
        });
    }

    /** To set current referesh data */
    setCurrentRefresh(currentRefresh) {
        setTimeout(() => {
            if (currentRefresh['processType'] === 'add') {
                this.refreshStatus = 'Adding';
                $('.infoMessageforRefresh').css('display', 'block');
            } else if (currentRefresh['processType'] === 'refresh') {
                this.refreshStatus = 'Refreshing';
                $('.infoMessageforRefresh').css('display', 'block');
            }
            this.currentRefresh = currentRefresh;
        }, 400);
    }

    /**
     * Check current refresh data
     */
    checkCurrentRefreshData() {
        const currentRefresh = this.accountHelper.getAddAccountData();
        if (currentRefresh && Object.keys(currentRefresh).length > 0) {
            this.currentRefresh = currentRefresh;
            this.checkAddAccountStatus();
        }
    }

    /** To set user name */
    showUserName() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser && currentUser.authtoken) {
            this.username = currentUser.username;
        }
    }

    /** To logout */
    logout() {
        setTimeout(() => {
            this.router.navigateByUrl('logout');
        }, 300);
    }

    /** To open mfa modal */
    openMfaModal() {
        this.mfaModalRef = this.modalService.show(this.mfaModal, Object.assign({}, this.modalConfig.config, {class: 'modal-md'}));
    }

    /** To close mfa modal */
    closeMfaModal() {
        this.mfaModalRef.hide();
        this.mfaModalRef = null;
    }

    /**
     * To check status of account during addition or refresh
     * @param any trackerId
     */
    checkRefreshDetail = (trackerId: any) => {
        const userData = {};
        userData['trackerId'] = trackerId;
        userData['userId'] = this.commonHttpAdapterService.getCurrentUserId();
        let institutionName = null;
        if (this.currentRefresh) {
            institutionName = this.currentRefresh.institutionName;
        }
        if (institutionName == null) {
            institutionName = 'Account';
        }
        this.isRefreshing = true;
        // const processType = $rootScope.currentRefresh.processType;
        const processType = this.currentRefresh.processType;
        const data = JSON.stringify(userData);
        if (this.showMFABox !== true) {
            this.loading = true;
        }

        this.accountService.checkRefreshDetail(data).subscribe(
            (response) => {
                if (response.status === 'completed') {
                    this.refreshStatus = null;
                    this.currentRefresh.refreshStatus = null;
                    this.isRefreshing = false;

                    // $rootScope.currentRefresh = null;
                    // $('#notificationModal').modal('show');
                    $('#addAccountbtn').removeAttr('disabled');
                    if (response.errorCode === 0) {
                        // console.log(window.location.href);
                        /* if ($scope.$parent.refreshPageData) {
                            if (window.location.href.indexOf('overview') > -1) {
                                this.$parent.refreshPageData();
                            } else {
                                window.location.reload(true);
                            }
                        } */

                        // $('.addAccountModal').modal('hide');
                        this.notificationComponent.openComonNotificationModal();  // notification modal open

                        const currentUrl = this.router.url;
                        if (currentUrl === '/overview') {
                            // if overview route
                            this.callBackOnAccountAdded.emit('added');  // callback
                        } else {

                        }
                        if (processType.indexOf('add') > -1) {
                            $('#notificationText').text('Your ' + institutionName + ' was added successfully');
                            this.notificationMessage = 'Your ' + institutionName + ' was added successfully';
                        } else {
                            this.notificationMessage = 'Your ' + institutionName + ' was refreshed successfully';
                            $('#notificationText').text('Your ' + institutionName + ' was refreshed successfully');
                        }
                        // remove currentRefresh data
                        this.accountHelper.removeAddAccountData();
                    } else {
                        $('#acaErrorMessage').addClass('pm-red');
                        this.notificationMessage = response.message;
                        this.notificationComponent.openComonNotificationModal();
                        $('#acaErrorMessage').text(response.message);
                        $('#notificationText').text(response.message);
                        // remove currentRefresh data
                        this.accountHelper.removeAddAccountData();
                    }
                    $('.infoMessageforRefresh').css('display', 'none'); // hiding add refresh header message
                    $('.infoMessageforAdd').css('display', 'none');
                    $('#addAccountLoader').css('display', 'none');
                    $('.account-action').removeAttr('disabled');
                    // clearInterval(this.checkRefreshIntervalId1);
                    /* if (this.checkRefreshIntervalId) {
                        console.log('clear interval');
                        clearInterval(this.checkRefreshIntervalId);
                    } */
                    this.stopInterval();
                } else if (response.status === 'in progress') {
                    $('.account-action').attr('disabled', 'disabled');
                    $('.infoMessageforRefresh').css('display', 'block');

                    setTimeout(() => {
                        this.currentRefresh.refreshStatus = response.message;
                        console.log(this.currentRefresh.refreshStatus);
                        this.refreshStatus = this.currentRefresh.refreshStatus;
                    }, 400);

                    $('.infoMessageBottom').css('display', 'block');
                    this.isRefreshing = true;
                } else {
                    $('.infoMessageforRefresh').css('display', 'none'); // hiding add refresh header message
                    $('.infoMessageforAdd').css('display', 'none');
                    $('#addAccountLoader').css('display', 'none');
                    $('.account-action').removeAttr('disabled');
                    // $('.addAccountModal').modal('hide');
                    $('#acaErrorMessage').addClass('pm-red');
                    $('#acaErrorMessage').text('Your add/refresh for ' + institutionName + ' was failed');
                    $('#notificationText').text('Your add/refresh for ' + institutionName + ' was failed');
                    // clearInterval(this.checkRefreshIntervalId);
                    this.stopInterval();
                    this.refreshStatus = null;
                    this.currentRefresh.refreshStatus = null;
                    // remove currentRefresh data
                    this.accountHelper.removeAddAccountData();
                }
            },
            error => {
                console.log('error');
            }
        )

    }

    /**
     * To check MFA(to ask otp)
     * @param any trackerId
     * @param any checkMFACount
     */
    checkMFA = (trackerId, checkMFACount) => {
        if (checkMFACount > 120) {
            return;
        }
        const userData = {};
        userData['trackerId'] = trackerId;
        userData['userId'] = this.commonHttpAdapterService.getCurrentUserId();

        const data = JSON.stringify(userData);
        this.accountService.checkMFA(data).subscribe(
            (response) => {
                if (response.mfaRequired === true) {
                    const mfaInfo = response.mfaInfo;
                    this.currentRefresh.mfaType = mfaInfo.mfaType;
                    this.currentRefresh.maxTime = mfaInfo.maxTime;
                    this.currentRefresh.mfaFields = mfaInfo.fields;
                    this.currentRefresh.mfaTrackerId = trackerId;
                    this.currentRefresh.mfaMessage = mfaInfo.message;
                    // $('#mfaModal').modal('show');
                    this.openMfaModal();
                    // $scope.$digest();


                } else if (response.mfaRequired === false && response.mfaUser === true && this.isRefreshing === true) {
                    setTimeout(() => {
                        this.checkMFA(trackerId, checkMFACount + 1);
                    }, 2000);
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    /**
     * Check Mfa, To validate otp
     */
    processMFA = () => {
        const userData = {};
        userData['trackerId'] = this.currentRefresh.mfaTrackerId;
        userData['userId'] = this.commonHttpAdapterService.getCurrentUserId();

        const fields = {};

        this.currentRefresh.mfaFields.forEach(function (field) {
            fields[field.fieldName] = field.fieldValue;
        });

        userData['mfaValueMap'] = fields;

        this.loading = true;
        this.showMFABox = false;
        this.showAccounts = true;
        const data = JSON.stringify(userData);
        this.accountService.processMFA(data).subscribe(
            (response) => {
                if (response === true) {
                    // $('#mfaModal').modal('hide');
                    this.closeMfaModal();
                } else {
                    this.closeMfaModal();
                    setTimeout(() => {
                        this.notificationMessage = 'MFA request failed.';
                        this.notificationComponent.openComonNotificationModal();
                        this.refreshStatus = null;
                    }, 300);
                    this.stopInterval();
                    $('#mfaModal').addClass('pm-red');
                    $('#mfaModal').text('MFA request failed.');
                }
            },
            error => {
                console.log('Something went wrong');
            }
        );
    }

    /** To check add account status */
    checkAddAccountStatus() {
        // if (this.currentRefresh && this.currentRefresh != null) {
        this.currentRefresh = this.accountHelper.getAddAccountData();
        this.setInstitutionNameInAction();
        this.onAddStartOverview();

        if (this.currentRefresh.refreshTriggered === false) {
            this.checkRefreshDetail(this.currentRefresh.trackerId);
            // this.checkRefreshIntervalId();
            this.startInterval();
            this.checkMFA(this.currentRefresh.trackerId, 0);
            this.currentRefresh.refreshTriggered = true;
        }
    }

    /**
     * To start interval to check refresh details
     */
    startInterval() {
        this.start_count += 1;
        if (this.start_count === 1) {
            /* this.checkRefreshIntervalId = () => {
                setInterval(() => {
                    this.checkRefreshDetail(this.currentRefresh.trackerId);
                }, 5000);
            } */
            this.checkRefreshIntervalId = setInterval(() => {
                this.checkRefreshDetail(this.currentRefresh.trackerId);
            }, 5000);

        }

        // this.checkRefreshIntervalId();
    }

    /**
     * To stop interval
     */
    stopInterval() {
        this.start_count = 0;
        clearInterval(this.checkRefreshIntervalId);
    }

    /**
     * Set institution name
     */
    setInstitutionNameInAction = () => {
        this.InstitutionNameInAction = this.currentRefresh.institutionName;
    }

    /** @ignore */
    onAddStartOverview = () => {
        $('.infoMessageforAdd').css('display', 'block');
        $('#addAccountLoader').css('display', 'block')
        // $("#addAccountBG").css('display', 'block');
        // $("#addAccountBG").removeAttr('disabled');
        $('.account-action').attr('disabled', 'disabled');
    }

    /**
     * To validate input fields
     */
    validateInputFields() {
        // numbers with points
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:no-unused-expression
        $(document).on('keydown', '.text-number', function (e) { -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) || /65|67|86|88/.test(e.keyCode) && (!0 === e.ctrlKey || !0 === e.metaKey) || 35 <= e.keyCode && 40 >= e.keyCode || (e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) && (96 > e.keyCode || 105 < e.keyCode) && e.preventDefault() });


        // for numbers with points 2 decimals
        $(document).on('keypress', '.pointNumber', function (event) {

            const $this = $(this);
            if ((event.which !== 46 || $this.val().indexOf('.') !== -1) &&
                ((event.which < 48 || event.which > 57) &&
                    (event.which !== 0 && event.which !== 8))) {
                event.preventDefault();
            }

            const text = $(this).val();
            if ((event.which === 46) && (text.indexOf('.') === -1)) {
                setTimeout(function () {
                    if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                        $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
                    }
                }, 1);
            }

            if ((text.indexOf('.') !== -1) &&
                (text.substring(text.indexOf('.')).length > 2) &&
                (event.which !== 0 && event.which !== 8) &&
                ($(this)[0].selectionStart >= text.length - 2)) {
                event.preventDefault();
            }
        });

        $(document).on('keypress', '.pointNumberFourDecimals', function (event) {

            const $this = $(this);
            if ((event.which !== 46 || $this.val().indexOf('.') !== -1) &&
                ((event.which < 48 || event.which > 57) &&
                    (event.which !== 0 && event.which !== 8))) {
                event.preventDefault();
            }

            const text = $(this).val();
            if ((event.which === 46) && (text.indexOf('.') === -1)) {
                setTimeout(function () {
                    if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                        $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
                    }
                }, 1);
            }

            if ((text.indexOf('.') !== -1) &&
                (text.substring(text.indexOf('.')).length > 4) &&
                (event.which !== 0 && event.which !== 8) &&
                ($(this)[0].selectionStart >= text.length - 2)) {
                event.preventDefault();
            }
        });

        // for numbers only
        $(document).on('keydown', '.number', function (e) {
            // console.log('keydown');
            const key = e.which || e.keyCode;

            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // numbers
                key >= 48 && key <= 57 ||
                // Numeric keypad
                key >= 96 && key <= 105 ||
                // Backspace and tab
                key === 8 || key === 9 ||
                // left and right arrows
                key === 37 || key === 39 || key === 46) {
                return true;
            }
            return false;
        })


        // To reset special charactes from text field
        $(document).on('keypress', 'input:not(.allowRestrictedChar):not(input[type=password]), textarea', function (event) {

            const inputProp = $(this);

            if (event.which === 60 || event.which === 62 || event.which === 37) {
                // $('#errormsgpopup').modal('show').css('zIndex','1060');
                // inputProp.css('border','1px solid red');
                event.preventDefault();
            }
        });

        $(document).on('paste input', 'input:not(.allowRestrictedChar):not(input[type=password]), textarea', function (event) {
            $(this).val($(this).val().replace(/[<>%]/g, ''));
        });
    }

    /**
     * Register chart js service to show center label message
     */
    registerChartJsService() {
        // to show the center level value chartjs
        Chart.pluginService.register({
            afterUpdate: function (chart) {
                if (chart.config.options.elements.center) {
                    const helpers = Chart.helpers;
                    const centerConfig = chart.config.options.elements.center;
                    const globalConfig = Chart.defaults.global;
                    const ctx = chart.chart.ctx;

                    const fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
                    const fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);
                    let fontSize;
                    if (centerConfig.fontSize) {
                        fontSize = centerConfig.fontSize;
                    } else {  // figure out the best font size, if one is not specified
                        ctx.save();
                        fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
                        const maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
                        const maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);

                        do {
                            ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
                            const textWidth = ctx.measureText(maxText).width;

                            // check if it fits, is within configured limits and that we are not simply toggling back and forth
                            if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize) {
                                fontSize += 1;
                            } else {
                                // reverse last step
                                fontSize -= 1;
                                break;
                            }
                        } while (true)
                        ctx.restore();
                    }

                    // save properties
                    chart.center = {
                        font: helpers.fontString(fontSize, fontStyle, fontFamily),
                        fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
                    };
                }
            },
            afterDraw: function (chart, easingValue) {
                if (chart.center) {
                    const centerConfig = chart.config.options.elements.center;
                    const ctx = chart.chart.ctx;

                    ctx.save();
                    ctx.font = chart.center.font;
                    ctx.fillStyle = chart.center.fillStyle;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
                    const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                    const txt = centerConfig.text;
                    const lineheight = 17;
                    let lines = '';
                    lines = txt.split('<br />');

                    for (let i = 0; i < lines.length; i++) {
                        ctx.fillText(lines[i], centerX, centerY + (i * lineheight));
                    }
                    ctx.restore();
                }

            }
        })
    }

    /**
     * To open setting modal
     */
    openSettingModal() {
        this.createChangeCredentailForm();
        setTimeout(() => {
            // tslint:disable-next-line:max-line-length
            this.settingModalRef = this.modalService.show(this.settingModal, Object.assign({}, this.modalConfig.config, {class: 'modal-md'}));
        }, 300);
    }

    /**
     * To close setting modal
     */
    closeSettingModal() {
        if (this.settingModalRef) {
            this.settingModalRef.hide();
            this.settingModalRef = null;
        }
        this.changePasswordDataLoading = false;
    }

    /**
     * To match password
     * @param string passwordKey
     * @param string passwordConfirmationKey
     */
    checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
        return (group: FormGroup) => {
            const passwordInput = group.controls[passwordKey],
                passwordConfirmationInput = group.controls[passwordConfirmationKey];
            if (passwordInput.value !== passwordConfirmationInput.value) {
                return passwordConfirmationInput.setErrors({ notEquivalent: true })
            } else {
                return passwordConfirmationInput.setErrors(null);
            }
        }
    }

    /**
     * Create Credential form
     */
    createChangeCredentailForm() {
        return this.changeCredentialForm = this._fb.group({
            oldPassword: [''],
            newPassword: ['' , [Validators.required, Validators.pattern(this.commonHelperService.pwdPattern)]],
            confirmPassword: ['',  [Validators.required, Validators.pattern(this.commonHelperService.pwdPattern)]]
        },
        [{ validator: this.checkIfMatchingPasswords('newPassword', 'confirmPassword') }])
    }

    /**
     * To change credentails
     */
    changeCredential() {
        document.getElementById('errorEditCred').children[0].innerHTML = '';
        const credentialFormData = this.changeCredentialForm.getRawValue();
        let userData: any = {};
        userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
        if (credentialFormData) {
            const oldPassword = credentialFormData['oldPassword'];
            const newPassword = credentialFormData['newPassword'];
            const confirmPassword = credentialFormData['confirmPassword'];

            if (!oldPassword) {
                document.getElementById('errorEditCred').children[0].innerHTML = 'Current password can not be empty';
                return;
            }
            if (newPassword !== confirmPassword) {
                document.getElementById('errorEditCred').children[0].innerHTML = 'New password and confirm password should be same';
                return;
            }
            userData['oldPassword'] = oldPassword;
            userData['password'] = newPassword;
            userData[CommonConstant.PLATFORM] = CommonConstant.PLATFORM_NAME;
            userData = JSON.stringify(userData);
            this.changePasswordDataLoading = true;

            this.commonService.updateCredentials(userData).subscribe(
                res => {
                    this.changePasswordDataLoading = false;
                    if (res[CommonConstant.ERROR_CODE] === 0) {
                        this.closeSettingModal();
                    } else {
                        document.getElementById('errorEditCred').children[0].innerHTML = res[CommonConstant.MESSAGE];
                    }
                },
                error => {
                    this.changePasswordDataLoading = false;
                    document.getElementById('errorEditCred').children[0].innerHTML = 'Something went wrong..Please try again';
                    console.log(error);
                }
            )
        }
    }

    /**
     * Password validation
     */
    checkPasswordValidation() {
        const input_value = $('#newPassword').val();

        const onlyNumber = /.*[0-9].*/;
        const smallCase = /.*[a-z].*/;
        const upperCase = /.*[A-Z].*/;
        const supportedSpecialChar = /.*[$@$!%*?&#~^].*/;

        // For number rangeChar
        if (input_value.length >= 8 && input_value.length <= 20) {
            $('#rangeChar').children().removeClass('glyphicon-remove').addClass('glyphicon-ok').removeClass('pm-red').addClass('pm-green');
        } else {
            $('#rangeChar').children().removeClass('glyphicon-ok').addClass('glyphicon-remove').removeClass('pm-green').addClass('pm-red');
        }

        // For Number Checking at least one
        if (onlyNumber.test(input_value)) {
            $('#onenumber').children().removeClass('glyphicon-remove').addClass('glyphicon-ok').removeClass('pm-red').addClass('pm-green');
        } else {
            $('#onenumber').children().removeClass('glyphicon-ok').addClass('glyphicon-remove').removeClass('pm-green').addClass('pm-red');
        }

        // For lowercase char Checking at least one
        if (smallCase.test(input_value)) {
            $('#onelower').children().removeClass('glyphicon-remove').addClass('glyphicon-ok').removeClass('pm-red').addClass('pm-green');
        } else {
            $('#onelower').children().removeClass('glyphicon-ok').addClass('glyphicon-remove').removeClass('pm-green').addClass('pm-red');
        }

        // For Uppercase char Checking at least one
        if (upperCase.test(input_value)) {
            $('#oneupper').children().removeClass('glyphicon-remove').addClass('glyphicon-ok').removeClass('pm-red').addClass('pm-green');
        } else {
            $('#oneupper').children().removeClass('glyphicon-ok').addClass('glyphicon-remove').removeClass('pm-green').addClass('pm-red');
        }

        // For Special Character Checking at least one
        if (supportedSpecialChar.test(input_value)) {
            $('#onesplchar').children().removeClass('glyphicon-remove').addClass('glyphicon-ok').removeClass('pm-red').addClass('pm-green');
        } else {
            $('#onesplchar').children().removeClass('glyphicon-ok').addClass('glyphicon-remove').removeClass('pm-green').addClass('pm-red');
        }
    }

    /**
     * Custom output functionality
     */
    editCustomHeader() {
        this.customOutputComponent.prepareCustomHeaderFunctionality();
    }

    /**
     * To delete custom header
     */
    deleteCustomHeader() {
        this.customOutputComponent.initiateCustomHeaderDelete();
    }

    /**
     * To add new header
     */
    addNewHeader() {
        this.customOutputComponent.addNewHeader();
    }
}
