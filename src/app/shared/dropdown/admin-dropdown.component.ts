import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../../shared/common/modal.config';

import { DropdownConstant } from './dropdown.constant';
import { CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';

import { DropdownService } from './dropdown.service';

@Component({
    selector: 'app-admin-dropdown',
    templateUrl: './admin-dropdown.component.html',
    styleUrls: ['./dropdown.component.css'],
    providers: [
        DropdownService, CommonHttpAdapterService
    ]
})
export class AdminDropdownComponent implements OnInit {

    @ViewChild('dropDownModal') dropDownModal: TemplateRef<any>;

    public dropDownModalRef: BsModalRef;

    // Dropdown Form
    public dropdownForm: FormGroup;

    constructor(
    private _fb: FormBuilder,
    private modalService: BsModalService,
    private dropdownService: DropdownService,
    private modalConfig: ModalConfig,
    private commonHttpAdapterService: CommonHttpAdapterService
    ) { }

    ngOnInit() {
    // To crate dropdown
        this.createDropdownForm();
    }


  /**
   * add dropdown list
   */
  createDropdownForm() {
    this.dropdownForm = this._fb.group({
      dropdown_type: [''],
      dropdownList: this._fb.array([
        this.initDropdown()
      ])
    })
  }

  initDropdown() {
    return this._fb.group({
      value: [''],
      display_text: ['']
    })
  }
  /**
   * To show dropdown modal
   */
  openDropdownModal() {
    this.dropDownModalRef = this.modalService.show(this.dropDownModal, Object.assign({}, this.modalConfig.config, {class: 'modal-md'}));
  }

  /**
   * To close dropdown modal
   */
  closeDropdownModal() {
    this.dropDownModalRef.hide();
    this.dropDownModalRef = null;
    this.dropdownForm.reset();
  }

  addNewDropdownRow() {
    const control = <FormArray>this.dropdownForm.controls['dropdownList'];
    control.push(this.initDropdown());
  }

  /**To remove existing dropdown row */
  removeDrodownRow(i: number) {
    const control = <FormArray>this.dropdownForm.controls['dropdownList'];
    control.removeAt(i);
  }

  /**
   * Submit dropdown element
   */
  submitDropdownElement() {
    const formValue = this.dropdownForm.getRawValue();
    let dropDownData: any = {};
    dropDownData['userId'] = this.commonHttpAdapterService.getCurrentUserId();
    dropDownData[DropdownConstant.DROPDOWN_TYPE] = formValue['dropdown_type'];
    const dropDownArray: any[] = [];
    let dropdowObj: any = {};
    formValue['dropdownList'].forEach(element => {
      dropdowObj = {};
      dropdowObj[DropdownConstant.DROPDOWN_VALUE] = element['value'];
      dropdowObj[DropdownConstant.DROPDOWN_DISPLAY_TEXT] = element['display_text'];

      dropDownArray.push(dropdowObj);
    });
    dropDownData[DropdownConstant.DROPDOWN_LIST] = dropDownArray;
    dropDownData = JSON.stringify(dropDownData);

    this.dropdownService.submitDropdownData(dropDownData).subscribe(
        res => {
            // console.log(res);
        },
        error => {
            console.log(error);
        }
    )
  }
}
