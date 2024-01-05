import { Injectable, Inject } from '@angular/core';
import { CommonConstant } from '../../constants/common/common.constant';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

/**
 * Form helper service class
 */
@Injectable()
export class FormHelper {

  /** @ignore */
  constructor(
    private _fb: FormBuilder
  ) { }

  /**
   * To clear form array data
   * @param FormGroup form
   * @param string listName
   */
  clearFormArray(form: FormGroup, listName: string) {
    const control = <FormArray>form['controls'][listName];
    const controlLength = form['controls'][listName]['controls'].length;
    for (let i = controlLength - 1; i >= 0; i--) {
      control.removeAt(i);
    }
  }

  /**
   * To clear child form array
   * @param FormGroup form
   * @param string listName
   * @param string childListName
   * @param number index
   */
  clearChildFormArray(form: FormGroup, listName: string, childListName: string, index: number) {
    const control = <FormArray>form.controls[listName]['controls'][index].controls[childListName];
    const controlLength = form['controls'][listName]['controls'][index].controls[childListName]['controls'].length;
    for (let i = controlLength - 1; i >= 0; i--) {
      control.removeAt(i);
    }
  }

  /**
   * To clear form array data
   * @param FormGroup form
   * @param string listName
   * @param number index
   */
  clearFormArrayObject(form: FormGroup, listName: string, index: number) {
    const control = <FormArray>form['controls'][listName];
    const controlLength = form['controls'][listName]['controls']
    control.removeAt(index);
  }

  /**
   * Remove comma from number
   * @param any value
   */
  removeCommaFromNumber(value: any) {
    if (value) {
      if (String(value).indexOf(',') !== -1) {
        value = value.replace(/[,]/g , '');
        return value;
      }
      return value;
    }
    return value;
  }

  /**
   * To initialize phone number array in contact information form
   * @param any element
   */
  public initPhoneNumber(element?) {
    let primarySelected: boolean;
    if (element) {
      if (typeof element === 'string') {
        primarySelected = false;
      } else if (typeof element === 'object') {
        let type = '';
        if (element[CommonConstant.TYPE]) {
          type = element[CommonConstant.TYPE].value;
        }
        return this._fb.group({
          id: element[CommonConstant.PLAIN_ID],
          type: type,
          areaCode: element[CommonConstant.AREA_CODE],
          countryCode: element[CommonConstant.COUNTRY_CODE],
          number: element[CommonConstant.NUMBER],
          active: element[CommonConstant.ACTIVE],
          primary: element[CommonConstant.PRIMARY],
          newField: false
        })
      }
    } else {
      primarySelected = true;
    }
    return this._fb.group({
      id: [''],
      type: [''],
      areaCode: [''],
      countryCode: [''],
      number: [''],
      active: [false],
      primary: [primarySelected],
      newField: [true]
    });
  }

  /**
   * To initialize address arry in contact information form
   * @param any element
   */
  public initAddress(element?) {
    let primarySelected: boolean;
    if (element) {
      if (typeof element === 'string') {
        primarySelected = false
      } else if (typeof element === 'object') {
        let type = '';
        if (element[CommonConstant.TYPE]) {
          type = element[CommonConstant.TYPE].value;
        }
        return this._fb.group({
          id: element[CommonConstant.PLAIN_ID],
          unitNo: element[CommonConstant.UNIT_NO],
          address1: element[CommonConstant.ADDRESS1],
          address2: element[CommonConstant.ADDRESS2],
          city: element[CommonConstant.CITY],
          state: element[CommonConstant.STATE],
          country: element[CommonConstant.COUNTRY],
          pinCode: element[CommonConstant.PIN_CODE],
          type: type,
          active: element[CommonConstant.ACTIVE],
          primary: element[CommonConstant.PRIMARY],
          newField: false
        })
      }
    } else {
      primarySelected = true;
    }
    return this._fb.group({
      id: [''],
      unitNo: [''],
      address1: [''],
      address2: [''],
      city: [''],
      state: [''],
      country: [''],
      pinCode: [''],
      type: [''],
      active: [false],
      primary: [primarySelected],
      newField: [true]
    })
  }

  /**
   * To intialize a email address
   * @param any element
   */
  public initEmailAddress(element?) {
    let primarySelected: boolean;
    if (element) {
      if (typeof element === 'string') {
        primarySelected = false;
      } else if (typeof element === 'object') {
        return this._fb.group({
          id: element[CommonConstant.PLAIN_ID],
          email: element[CommonConstant.EMAIL],
          primary: element[CommonConstant.PRIMARY],
          active: element[CommonConstant.ACTIVE],
          newField: false
        })
      }
    } else {
      primarySelected = true;
    }
    return this._fb.group({
      id: [''],
      email: [''],
      primary: [primarySelected],
      active: [false],
      newField: [true]
    })
  }

  /**
   * TO intialize a contact person
   * @param any element
   */
  public initContactPerson(element?) {
    if (element) {
      if (typeof element === 'object') {
        return this._fb.group({
          id: element[CommonConstant.PLAIN_ID],
          name: element[CommonConstant.NAME],
          contactPhoneNumberList: this._fb.array([
            this.initPhoneNumber()
          ]),
          contactEmailList: this._fb.array([
            this.initEmailAddress()
          ]),
          contactAddressList: this._fb.array([
            this.initAddress()
          ]),
          newField: false
        })
      }
    } else {
      return this._fb.group({
        id: [''],
        name: [''],
        contactPhoneNumberList: this._fb.array([
          this.initPhoneNumber()
        ]),
        contactEmailList: this._fb.array([
          this.initEmailAddress()
        ]),
        contactAddressList: this._fb.array([
          this.initAddress()
        ]),
        newField: [true]
      })
    }
  }

  /**
   * To initalize a advisor
   * @param any element
   */
  initAdvisor(element?) {
    let primarySelected: boolean;
    if (element) {
      if (typeof element === 'object') {
        return this._fb.group({
          id: element[CommonConstant.PLAIN_ID],
          advisorName: element[CommonConstant.PLAIN_ID],
          primary: element[CommonConstant.PRIMARY],
          advisorClientMapId: element[CommonConstant.ADVISOR_CLIENT_MAP_ID],
          active: [false],
          newField: false
        })
      } else if (typeof element === 'string') {
        primarySelected = false;
      }
    } else {
      primarySelected = true;
    }
    return this._fb.group({
      id: [''],
      advisorName: [''],
      primary: [primarySelected],
      advisorClientMapId: [''],
      active: [false],
      newField: [true]
    })
  }

  /**
   * To intialize id
   * @param any element
   */
  initId(element?) {
    if (element) {
      let type = '';
      if (element[CommonConstant.TYPE]) {
        type = element[CommonConstant.TYPE].value;
      }
      return this._fb.group({
        id: element[CommonConstant.PLAIN_ID],
        type: type,
        idNo: element[CommonConstant.ID_NO],
        newField: false
      })
    } else {
      return this._fb.group({
        id: [''],
        type: [''],
        idNo: [''],
        newField: [true]
      })
    }
  }
}
