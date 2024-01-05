import { CommonConstant } from '../../constants/common/common.constant';
import { AccountConstant } from '../../constants/account/account.constant';

/** Account Helper Class */
export class AccountHelper {

    /**
     * Sub assured meta data
     */
    public sumAssuredList: any[] = [
        {
            label: 'Death', 'value': AccountConstant.DEATH
        },
        {
            label: 'Accidental Death', 'value': AccountConstant.ACCIDENTAL_DEATH
        },
        {
            label: 'Permanent Disablility', 'value': AccountConstant.PERMANENT_DISABLITY
        },
        {
            label: 'Crtitical Illness', 'value': AccountConstant.CRITICAL_ILLNESS
        }
    ];

    /** @ignore */
    constructor() {  }

    /**
     * To set upload statement data
     * @param any v
     */
    public setUploadStatementData(v: any) {
        // console.log(v);
        let uploadStData: any = {};
        if (v[CommonConstant.REPO_ID]) {
            uploadStData[CommonConstant.FILE_REPO_ID] = v[CommonConstant.REPO_ID];
        } else if (v[CommonConstant.PLAIN_ID]) {
            uploadStData[CommonConstant.FILE_REPO_ID] = v[CommonConstant.PLAIN_ID];
        }
        uploadStData = JSON.stringify(uploadStData);
        // console.log(uploadStData);
        sessionStorage.setItem('statementData', uploadStData);

        let fileRepoId = sessionStorage.getItem('statementData');
        fileRepoId = JSON.parse(fileRepoId);
        // console.log(fileRepoId);
    }

    /**
     * To get upload statement data
     */
    public getUploadStatementData(): any {
        let statementData = sessionStorage.getItem('statementData');
        if (statementData) {
            statementData = JSON.parse(statementData);
            return statementData;
        }
        return {};
    }

    /**
     * To set add account data
     */
    public setAddAccountData(v: any) {
        if (Object.keys(v).length > 0) {
            v = JSON.stringify(v);

            sessionStorage.setItem('currentRefresh', v);
        }
    }

    /**
     * To get add account data
     */
    public getAddAccountData(): any {
        let currentRefresh = sessionStorage.getItem('currentRefresh');
        if (currentRefresh) {
            currentRefresh = JSON.parse(currentRefresh);
            return currentRefresh;
        }
        return {};
    }

    /**
     * To remove add account data from localstorage
     */
    public removeAddAccountData() {
        const currentRefresh = sessionStorage.getItem('currentRefresh');
        if (currentRefresh) {
            sessionStorage.removeItem('currentRefresh');
        }
    }

    /**
     * Group by institution Name
     * @param any[] value
     * @param string field
     */
    public groupByInstitution(value: any[], field: string): any[] {
        const groupedObj = value.reduce((prev, cur) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            } else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        return Object.keys(groupedObj).map(
            objKey => {
                let key: any = {};
                if (groupedObj[objKey].length > 0) {
                    let sum = 0;
                    groupedObj[objKey].forEach(element => {
                        sum = sum + parseFloat(element.convertedBalance);
                    });
                    groupedObj[objKey][0]['totalBalance'] = sum;
                    key = groupedObj[objKey][0];
                }
                return {
                    // objKey, value: groupedObj[objKey]
                    key, value: groupedObj[objKey]
                }
            });
    }


}
