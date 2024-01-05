import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import { CommonConstant } from '../../constants/common/common.constant';
import { ClientConstant } from '../../constants/client/client.constant';
import { CarrierConstant } from '../../constants/carrier/carrier.constant';

/**
 * Client helper service class
 */
@Injectable()
export class ClientHelper {

    private _clientData: any = {};
    private _newclientData: any = {};

    /** @ignore */
    constructor(
        private _fb: FormBuilder
    ) {  }

    /**
     * To get stored carrier data object
     */
    public getClientData(): any {
        let clientData = sessionStorage.getItem('clientData');
        if (clientData) {
            clientData = JSON.parse(clientData);
            return clientData;
        }
        return {};
    }

    /**
     * To get client ID
     */
    public getClientId() {
        let clientData = sessionStorage.getItem('clientData');
        if (clientData) {
            clientData = JSON.parse(clientData);
            return clientData['clientId'];
        }
    }

    /**
     * To set client data object
     * @param any v
     */
    public setClientData(v: any) {
        // console.log(v);
        if (Object.keys(v).length > 0) {
            this._clientData = {};
            this._clientData['clientId'] = v[CommonConstant.PLAIN_ID];

            this._clientData = JSON.stringify(this._clientData);
            sessionStorage.setItem('clientData', this._clientData);
        } else {
            this._clientData = {};
            this._clientData = JSON.stringify(this._clientData);
            sessionStorage.setItem('clientData', this._clientData);
        }
    }

    /**
     * To get stored client data
     */
    public getNewClientData(): any {
        return this._newclientData;
    }

    /**
     * To set client data
     * @param any v
     */
    public setNewClientData(v: any) {
        // console.log(v);
        this._newclientData = {};
        this._newclientData = v;
    }

    /**
     * To set policy process id
     * @param string id
     */
    public setPolicyPocessId(id: string) {
        const processId = id;
        let policyData: any = {};
        if (processId) {
            policyData['processId'] = processId;
            policyData = JSON.stringify(policyData);
            sessionStorage.setItem('policyData', policyData);
        }
    }

    /**
     * To get policy process id
     */
    public getPolicyProcessId() {
        let policyData = sessionStorage.getItem('policyData');
        console.log(policyData);
        if (policyData) {
            policyData = JSON.parse(policyData);
            return policyData['processId'];
        }
    }

    /**
     * To initialize household member array for individal form
     * @param element
     */
    initHouseholdMember(element?) {
        let headSelected: boolean;
        if (element) {
        if (typeof element === 'string') {
            headSelected = false;
        } else if (typeof element === 'object') {
            let relationship = '';
            if (element[ClientConstant.RELATIONSHIP_WITH_HEAD]) {
                relationship = element[ClientConstant.RELATIONSHIP_WITH_HEAD]['value'];
            }
            return this._fb.group({
                id: element[CommonConstant.PLAIN_ID],
                memberName: element[ClientConstant.MEMBER_NAME],
                head: element[ClientConstant.HOUSEHOLD_HEAD],
                relationship: relationship,
                premium: element[ClientConstant.PREMIUM],
                newField: false
            })
        }
        } else {
        headSelected = true;
        }
        return this._fb.group({
            id: [''],
            memberName: [''],
            head: [headSelected],
            relationship: [''],
            premium: [''],
            newField: [true]
        })
    }

    /**
     * To initialize identity deial array for individal form
     * @param any element
     */
    initIdentityDetail(element?) {
        if (element) {
        return this._fb.group({
            id: element[CommonConstant.PLAIN_ID],
            identityType: element[ClientConstant.IDENTITY_TYPE],
            countryOfIssuance: element[ClientConstant.COUNTRY_OFF_ISSUANCE],
            idNo: element[ClientConstant.ID_NO],
            newField: false
        })
        } else {
        return this._fb.group({
            id: [''],
            identityType: [''],
            countryOfIssuance: [''],
            idNo: [''],
            newField: [true]
        })
        }
    }

  /**
   * To initialize business registration detail array
   * @param any element
   */
  initBusinessRegistrationDetail(element?) {
    if (element) {
      return this._fb.group({
        id: element[CommonConstant.PLAIN_ID],
        agency: element[ClientConstant.AGENCY],
        segment: element[ClientConstant.SEGEMENT],
        regNo: element[ClientConstant.REG_NO],
        newField: false
      })
    } else {
      return this._fb.group({
        id: [''],
        agency: [''],
        segment: [''],
        regNo: [''],
        newField: [true]
      })
    }
  }

  /**
   * To initialize a advisor
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
          active: [false]
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
      active: [false]
    })
  }

  /**
   * To initialize a policy premium
   * @param any premium
   * @param any loadingPremium
   * @param any premiumFreq
   * @param any targetPremiumApplicable
   * @param any targetPremium
   * @param any targetPremiumFrequency
   */
  initPolicyPremium(premium?, loadingPremium?, premiumFreq?, targetPremiumApplicable?, targetPremium?, targetPremiumFrequency?) {
    if (premium || targetPremium) {
      let targetPremApplicable = false, targetPrem = '', targetPremFreq = '';
      if (targetPremiumApplicable) {
        targetPremApplicable = targetPremiumApplicable;
      }
      if (targetPremium) {
        targetPrem = targetPremium;
      }
      if (targetPremiumFrequency) {
        targetPremFreq = targetPremiumFrequency;
      }
      return this._fb.group({
        premium: this.initPremium(premium, premiumFreq),
        loadingPremium: this.initLoadingPremium(loadingPremium, premiumFreq),
        targetPremiumApplicable: [targetPremiumApplicable],
        targetPremium: this.initTargetPremium(targetPrem, targetPremFreq)
      })
    } else {
      return this._fb.group({
        premium: this.initPremium(),
        loadingPremium: this.initLoadingPremium(),
        targetPremiumApplicable: [false],
        targetPremium: this.initTargetPremium()
      })
    }
  }

  /**
   * To intialize premium
   * @param any premium
   * @param any premiumFreq
   */
  initPremium(premium?, premiumFreq?) {
    if (premium) {
      return this._fb.group({
        premium: [{value: 'Model Premium', disabled: true}],
        premiumFrequency: [premiumFreq],
        amount: [premium],
        payableUpto: ['']
      })
    } else {
      return this._fb.group({
        premium: [{value: 'Model Premium', disabled: true}],
        premiumFrequency: ['annually'],
        amount: [''],
        payableUpto: ['']
      })
    }
  }

  /**
   * To intialize loading premium
   * @param any loadingPremium
   * @param any premiumFreq
   */
  initLoadingPremium(loadingPremium?, premiumFreq?) {
    if (loadingPremium) {
      return this._fb.group({
        premium: [{value: 'Loading Premium', disabled: true}],
        premiumFrequency: [{value: premiumFreq, disabled: true}],
        amount: loadingPremium,
        payableUpto: ['']
      })
    } else {
      return this._fb.group({
        premium: [{value: 'Loading Premium', disabled: true}],
        premiumFrequency: [{value: 'annually', disabled: true}],
        amount: [''],
        payableUpto: ['']
      })
    }
  }

  /**
   * To intialize target premium
   * @param any targetPremium
   * @param any targetPremiumFrequency
   */
  initTargetPremium(targetPremium?, targetPremiumFrequency?) {
    if (targetPremium) {
      return this._fb.group({
        premium: [{value: 'Target Premium', disabled: true}],
        targetPremium: [targetPremium],
        targetPremiumFrequency: [targetPremiumFrequency],
        payableUpto: ['']
      })
    } else {
      return this._fb.group({
        premium: [{value: 'Target Premium', disabled: true}],
        targetPremium: [''],
        targetPremiumFrequency: ['na'],
        payableUpto: ['']
      })
    }
  }

  /**
   * To get months from commission term
   * @param commTerm
   */
  getCommissionTermMonth(commTerm) {
    if (commTerm) {
        commTerm = Number(commTerm);
        const months = commTerm % 12;
        return months;
    }
  }
  /**
   * To get years from commission term
   * @param any commTerm
   */
  getCommissionTermYear(commTerm) {
    if (commTerm) {
        commTerm = Number(commTerm);
        const years = Math.floor(commTerm / 12);
        return years;
    }
  }

  /**
   * To initialize rider premium
   * @param any element
   * @param any premiumFreq
   */
  initRiderPremium(element?, premiumFreq?) {
    if (element) {
      let policyRiderTermMonth: number, policyRiderTermYear: number, riderName = '';
      if (element[CarrierConstant.POLICY_RIDER_TERM]) {
        policyRiderTermMonth = this.getCommissionTermMonth(element[CarrierConstant.POLICY_RIDER_TERM]);
        policyRiderTermYear = this.getCommissionTermYear(element[CarrierConstant.POLICY_RIDER_TERM]);
      }
      if (element[CommonConstant.NAME]) {
        riderName = element[CommonConstant.NAME]
      }
      return this._fb.group({
        id: element[CommonConstant.PLAIN_ID],
        name: riderName,
        rider: element[CarrierConstant.POLICY_PLAN_RIDER1_ID],
        riderTermId: element[ClientConstant.POLICY_PLAN_RIDER_TERM_ID],
        policyRiderTermMonth: policyRiderTermMonth,
        policyRiderTermYear: policyRiderTermYear,
        death: element[ClientConstant.DEATH],
        permanentDisability: element[ClientConstant.PERMANENT_DISABLITY],
        criticalIllness: element[ClientConstant.CRITICAL_ILLNESS],
        accidentalDeath: element[ClientConstant.ACCIDENTAL_DEATH],
        premium: this.initRidersPremium(element[ClientConstant.PREMIUM], premiumFreq),
        loadingPremium: this.initRidersLoadingPremium(element[ClientConstant.LOADING_PREMIUM], premiumFreq),
        selected: [false],
        newField: false
      })
    } else {
      return this._fb.group({
        id: [''],
        name: [''],
        rider: [''],
        riderTermId: [''],
        policyRiderTermMonth: [''],
        policyRiderTermYear: [''],
        death: [''],
        permanentDisability: [''],
        criticalIllness: [''],
        accidentalDeath: [''],
        premium: this.initRidersPremium(),
        loadingPremium: this.initRidersLoadingPremium(),
        selected: [false],
        newField: [true]
      })
    }
  }

  /**
   * To intialize rier premium
   * @param any premium
   * @param any premiumFreq
   */
  initRidersPremium(premium?, premiumFreq?) {
    let premiumFrequency;
    if (premiumFreq) {
      premiumFrequency = premiumFreq;
    } else {
      premiumFrequency = '';
    }

    const payableDate = '';

    if (premium) {
      return this._fb.group({
        premium: [{value: 'Model Premium', disabled: true}],
        premiumFrequency: [{value: premiumFrequency, disabled: true}],
        amount: premium,
        payableUpto: payableDate,
        newField: false
      })
    } else {
      return this._fb.group({
        premium: [{value: 'Model Premium', disabled: true}],
        premiumFrequency: [{value: premiumFrequency, disabled: true}],
        amount: [''],
        payableUpto: [payableDate],
        newField: [true]
      })
    }
  }

  /**
   * To initialize a rider loading premium
   * @param loadingPremium
   * @param premiumFreq
   */
  initRidersLoadingPremium(loadingPremium?, premiumFreq?) {
    let premiumFrequency;
    if (premiumFreq) {
      premiumFrequency = premiumFreq;
    } else {
      premiumFrequency = '';
    }

    const payableDate = '';

    if (loadingPremium) {
      return this._fb.group({
        premium: [{value: 'Loading Premium', disabled: true}],
        premiumFrequency: [{value: premiumFrequency, disabled: true}],
        amount: loadingPremium,
        payableUpto: payableDate,
        newField: false
      })
    } else {
        return this._fb.group({
          premium: [{value: 'Loading Premium', disabled: true}],
          premiumFrequency: [{value: premiumFrequency, disabled: true}],
          amount: [''],
          payableUpto: [payableDate],
          newField: [true]
        })
    }
  }

  /**
   * To get frequency to send to server
   * @param any flag
   */
  getFrequency(flag) {
    if (flag === 'annually') {
      return CommonConstant.FREQUENCY_YEARLY;
    } else if (flag === 'semi-annually') {
      return CommonConstant.FREQUENCY_HALF_YEARLY;
    } else if (flag === 'quarterly') {
      return CommonConstant.FREQUENCY_QUARTERLY;
    } else if (flag === 'monthly') {
      return CommonConstant.FREQUENCY_MONTHLY;
    } else {
      return null;
    }
  }

}
