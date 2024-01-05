import { Component, OnInit, Input, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../../shared/common/modal.config';

import { CommonConstant } from '../../constants/common/common.constant';
import { DropdownConstant } from './dropdown.constant';
import { CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';

import { DropdownService } from '../dropdown/dropdown.service';

/**
* This class represents the lazy loaded DropdownComponent.
*/
@Component({
    selector: 'app-dropdown',
    templateUrl: 'dropdown.component.html',
    styleUrls: ['dropdown.component.css'],
    providers: [
        DropdownService
    ]
})
export class DropdownComponent implements OnInit {

    /** Dropdown modal reference */
    @ViewChild('dropdownModal', {static: false}) dropdownModal: TemplateRef<any>;

    /** Dropdown delete modal reference */
    @ViewChild('dropdownDeleteModal', {static: false}) dropdownDeleteModal: TemplateRef<any>;

    /** Dropdown remove modal */
    @ViewChild('dropdownRemoveModal', {static: false}) dropdownRemoveModal: TemplateRef<any>;

    public dropdownList: Array<any> = [];
    public tempDropdownList: Array<any> = [];

    // @Input() dropdownList;

    @Output() onDropdownChanged: EventEmitter<any> = new EventEmitter();

    private dropdownObject: any = {};
    private dropdownEditObject: any = {};
    private newPolicyTypeObject: any = {};
    private newDropdownIndex: number;
    public dropdown: any = {};

    public editDropdownForm: FormGroup;
    public addDropdownForm: FormGroup;
    public modalRef: BsModalRef;
    public delModalRef: BsModalRef;
    public removeModalRef: BsModalRef;

    public filterDropdown;

    /** @ignore */
    constructor(
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private modalConfig: ModalConfig,
        private _sanitizer: DomSanitizer,
        private dropdownService: DropdownService,
        private commonHttpAdapterService: CommonHttpAdapterService
    ) {}

    /** @ignore */
    ngOnInit() {

    }

    /**
     * To open dropdown modal
     */
    openDropdownModal() {
        this.tempDropdownList = this.dropdownList;
        this.modalRef = this.modalService.show(this.dropdownModal, Object.assign({}, this.modalConfig.config, {class: 'modal-md'}));
    }

    /**
     * To close or hide dropdown modal
     */
    cancelDropdownModal() {
        this.modalRef.hide();
        this.modalRef = null;

        // to hide editable mode and disabled property
        this.tempDropdownList.forEach(element => {
            element.editable = false;
            element.disabled = false;
        });
    }

    /** Auto complete list formatter */
    autocompleListFormatter = (data: any): SafeHtml => {
        const html = `<span>${data.type}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }

    /**
     * To open dropdown delete modal
     */
    openDropdownDeleteModal(dropdown, index: number) {
        this.dropdownObject = dropdown;
        this.dropdownObject['dropdownIndex'] = index;
        // tslint:disable-next-line:max-line-length
        this.delModalRef = this.modalService.show(this.dropdownDeleteModal, Object.assign({}, this.modalConfig.config, {class: 'modal-sm deleteTransconfModal'}));
    }

    /**
     * To close dropdown delete modal
     */
    closeDropdownDeleteModal() {
        this.delModalRef.hide();
        this.delModalRef = null;
    }

    /**
     * To add a new dropdown
     * @param number index
     * @param any dropdown
     * @param string addType
     */
    addDropdown(index: number, dropdown, addType: string) {
        const obj: any = {};
        this.dropdownObject = {};
        if (addType === 'addnew') {
            obj['id'] = '';
            obj['dropdownType'] = dropdown['dropdownType'];
            obj['displayText'] = '';
            obj['value'] = '';
            obj['newField'] = true;
            obj['editable'] = false;
        } else {
            obj['id'] = '';
            obj['dropdownType'] = dropdown['dropdownType'];
            obj['displayText'] = dropdown['displayText'];
            obj['value'] = dropdown['value'];
            obj['newField'] = true;
            obj['editable'] = false;
        }
        this.dropdownObject = Object.assign({}, obj);
        this.tempDropdownList.splice(index + 1, 0, obj);

        this.tempDropdownList.forEach(element => {
            element.disabled = true;
        });
    }

    /**
     * To open dropdown remove moda
     */
    openDropdownRemoveModal() {
        // tslint:disable-next-line:max-line-length
        this.removeModalRef = this.modalService.show(this.dropdownRemoveModal, Object.assign({}, this.modalConfig.config, {class: 'modal-sm deleteTransconfModal'}));
    }

    /**
     * To close dropdown remove modal
     */
    closeDropdownRemoveModal() {
        this.removeModalRef.hide();
        this.removeModalRef = null;
    }

    /**
     * To cancel or ignore new dropdown
     * @param number index
     * @param any dropdown
     */
    cancelNewDropdown(index: number, dropdown) {
        this.newDropdownIndex = index;
        // If input field has value then show popup
        if (this.dropdownObject['displayText'] || this.dropdownObject['value']) {
            this.openDropdownRemoveModal();
        } else {
            this.tempDropdownList.splice(this.newDropdownIndex, 1);
            this.tempDropdownList.forEach(element => {
                element.disabled = false;
            });
        }
    }

    /**
     * To remove dropdown
     */
    removeDropdown() {
        this.tempDropdownList.splice(this.newDropdownIndex, 1);
        this.closeDropdownRemoveModal();
        this.tempDropdownList.forEach(element => {
            element.disabled = false;
        });
    }

    /**
     * To edit dropdown data
     * @param any dropdown
     */
    editDropdown(dropdown) {
        this.tempDropdownList.forEach(element => {
            element.editable = false;
            element.disabled = true;
        });
        // shallow copy of dropdown object
        this.dropdownObject = {};
        this.dropdownObject = Object.assign({}, dropdown);
        dropdown.disabled = false;
        dropdown.editable = true;
    }

    /**
     * To cancel editable mode
     * @param any dropdown
     */
    cancelDropdown(dropdown) {
        this.tempDropdownList.forEach(element => {
            element.disabled = false;
            element.editable = false;
        });
        dropdown.editable = false;
        /* console.log('**** original dropdown object****');
        this.dropdownObject = dropdown;
        console.log(this.dropdownObject); */
    }

    /**
     * To submit new dropdown
     * @param number index
     * @param any dropdown
     */
    submitDropdown(index: number, dropdown) {
        document.getElementById('dropdownErrMessage').innerHTML = '';
        let dropdownData: any = {};
        dropdownData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
        dropdownData[DropdownConstant.DROPDOWN_TYPE] = this.dropdownObject[DropdownConstant.DROPDOWN_TYPE];
        const dropdowObj: any = {};
        if (!this.dropdownObject[DropdownConstant.DROPDOWN_VALUE]) {
            document.getElementById('dropdownErrMessage').innerHTML = 'Please enter dropdown value';
            return;
        }
        if (!this.dropdownObject[DropdownConstant.DROPDOWN_DISPLAY_TEXT]) {
            document.getElementById('dropdownErrMessage').innerHTML = 'Please enter dropdown text';
            return;
        }
        dropdowObj[DropdownConstant.DROPDOWN_VALUE] = this.dropdownObject[DropdownConstant.DROPDOWN_VALUE];
        dropdowObj[DropdownConstant.DROPDOWN_DISPLAY_TEXT] = this.dropdownObject[DropdownConstant.DROPDOWN_DISPLAY_TEXT];

        dropdownData[DropdownConstant.DROPDOWN] = dropdowObj;
        dropdownData = JSON.stringify(dropdownData);

        this.dropdownService.addDropdownData(dropdownData).subscribe(
            res => {
                if (res[CommonConstant.ERROR_CODE] === 0) {
                    this.onDropdownChanged.emit(dropdownData);
                    this.tempDropdownList[index] = res[CommonConstant.DATA];
                    // to hide editable mode and disabled property
                    this.tempDropdownList.forEach(element => {
                        element.editable = false;
                        element.disabled = false;
                    });
                } else {
                    document.getElementById('dropdownErrMessage').innerHTML = res[CommonConstant.MESSAGE];
                }
            },
            error => {
                document.getElementById('dropdownErrMessage').innerHTML = 'Something went wrong..Please try again.'
            }
        )
    }

    /**
     * To update existing dropdown
     * @param number index
     * @param any dropdown
     */
    updateDropdown(index: number, dropdown) {
        document.getElementById('dropdownErrMessage').innerHTML = '';
        let dropdownData: any = {};
        dropdownData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
        dropdownData[CommonConstant.PLAIN_ID] = this.dropdownObject[CommonConstant.PLAIN_ID];
        dropdownData[DropdownConstant.DROPDOWN_VALUE] = this.dropdownObject[DropdownConstant.DROPDOWN_VALUE];
        dropdownData[DropdownConstant.DROPDOWN_DISPLAY_TEXT] = this.dropdownObject[DropdownConstant.DROPDOWN_DISPLAY_TEXT];

        dropdownData = JSON.stringify(dropdownData);

        this.dropdownService.updateDropdownData(dropdownData).subscribe(
            res => {
                if (res[CommonConstant.ERROR_CODE] === 0) {
                    this.onDropdownChanged.emit(dropdownData);
                    this.tempDropdownList[index] = res[CommonConstant.DATA];
                    this.tempDropdownList.forEach(element => {
                        element.editable = false;
                        element.disabled = false;
                    });
                } else {
                    document.getElementById('dropdownErrMessage').innerHTML = res[CommonConstant.MESSAGE];
                }
            },
            error => {
                document.getElementById('dropdownErrMessage').innerHTML = 'Something went wrong..Please try again.'
            }
        )
    }

    /**
     * To delete dropdown data
     */
    deleteDropdown() {
        document.getElementById('dropdownErrMessage').innerHTML = '';
        let dropdownData: any = {};
        dropdownData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
        // dropdownData[DropdownConstant.DROPDOWN_TYPE] = dropdown[DropdownConstant.DROPDOWN_TYPE];
        dropdownData[CommonConstant.PLAIN_ID] = this.dropdownObject[CommonConstant.PLAIN_ID];

        dropdownData = JSON.stringify(dropdownData);

        this.dropdownService.deleteDropdownData(dropdownData).subscribe(
            res => {
                this.closeDropdownDeleteModal();
                if (res[CommonConstant.ERROR_CODE] === 0) {
                    this.onDropdownChanged.emit(dropdownData);
                    this.tempDropdownList.splice(this.dropdownObject['dropdownIndex'], 1);  // remove deleted item
                    this.tempDropdownList.forEach(element => {
                        element.editable = false;
                        element.disabled = false;
                    });
                } else {
                    document.getElementById('dropdownErrMessage').innerHTML = res[CommonConstant.MESSAGE];
                }
            },
            error => {
                document.getElementById('dropdownErrMessage').innerHTML = 'Something went wrong..Please try again.'
            }
        )
    }
}
