import { CommonConstant } from '../../constants/common/common.constant';

/**
 * Review class helper
 */
export class Review {

    /** @ignore */
    constructor() {  }

    /**
     * To save uploaded xml data to localstorage
     * @param any v
     */
    public setUploadXMLStatementData(v: any) {
        let uploadStData: any = {};
        uploadStData[CommonConstant.FILE_REPO_ID] = v[CommonConstant.PLAIN_ID];
        uploadStData = JSON.stringify(uploadStData);
        console.log(uploadStData);
        sessionStorage.setItem('XMLStatementData', uploadStData);

        let repoId = sessionStorage.getItem('XMLStatementData');
        repoId = JSON.parse(repoId);
        console.log(repoId);
    }

    /**
     * To get uploaded xml data from localstorage
     */
    public getUploadXMLStatementData(): any {
        let XMLStatementData = sessionStorage.getItem('XMLStatementData');
        console.log(XMLStatementData);
        if (XMLStatementData) {
            XMLStatementData = JSON.parse(XMLStatementData);
            return XMLStatementData;
        }
        return {};
    }


}
