/**
 * Common constants class
 */
export class CommonConstant {

    public static readonly USER_ID: string = 'userId';
    public static readonly USERNAME: string = 'username';
    public static readonly PASSWORD: string = 'password';
    public static readonly AUTH_TOKEN: string = 'authtoken';
    public static readonly EMAIL: string = 'email';
    public static readonly TIMESTAMP: string = 'timestamp';
    public static readonly PLATFORM: string = 'platform';
    public static readonly PLATFORM_NAME: string = 'conjurer';
    public static readonly OTP: string = 'otp';

    public static readonly ERROR_CODE: any = 'errorCode';
    public static readonly SUCCESS: string = 'Success';
    public static readonly FAIL: string = 'Failed';
    public static readonly MESSAGE: string = 'message';
    public static readonly STATUS: string = 'status';
    public static readonly FLOW: string = 'flow';  // for preview - pimoney and for review - gx
    public static readonly FILE_REPO_ID: string = 'fileRepoId';
    public static readonly REPO_ID: string = 'repoId';
    public static readonly NAME: string = 'name';
    public static readonly FILE_NAME: string = 'fileName';
    public static readonly FILE_PATH: string = 'filePath';
    public static readonly REMEMBER: string = 'remember';
    public static readonly CODE: string = 'code';
    public static readonly TAG: string = 'tag';
    public static readonly BAND: string = 'band';
    public static readonly BANK_ACCOUNT_TYPE: string = 'Bank';
    public static readonly CREDITCARD_ACCOUNT_TYPE: string = 'Card';
    public static readonly LOAN_ACCOUNT_TYPE: string = 'Loan';
    public static readonly INVESTMENT_ACCOUNT_TYPE: string = 'Investment';
    public static readonly RESULT: string = 'result';
    public static readonly PREFERRED_CURRENCY: string = 'preferredCurrency';
    public static readonly ABBREVIATION: string = 'abbreviation';

    public static readonly CURRENCY: string = 'currency';
    public static readonly AMOUNT: string = 'amount';
    public static readonly PLAIN_ID: string = 'id';
    public static readonly BYTE_CODE: string = 'byteCode';
    public static readonly ACCOUNT_NAME: string = 'accountName';
    public static readonly ACCOUNT_NUMBER: string = 'accountNumber';
    public static readonly ACCOUNT_ID: string = 'accountId';
    public static readonly STATEMENT_GROUP_ID: string = 'stmtGroupId';
    public static readonly ACCOUNT_TYPE: string = 'accountType';
    public static readonly INSTITUTION_NAME: string = 'institutionName';
    public static readonly INSTITUTION_CODE: string = 'institutionCode';
    public static readonly FILES: string = 'files';
    public static readonly XML_STRING: string = 'xmlString';
    public static readonly XML: string = 'xml';
    public static readonly TYPE: string = 'type';
    public static readonly VALUE: string = 'value';
    public static readonly KEY: string = 'key';
    public static readonly DATA: string = 'data';
    public static readonly TRACKER_ID: string = 'trackerId';
    public static readonly PRIMARY: string = 'primary';
    public static readonly IMAGE_ICON: string = 'imageIcon';
    public static readonly POLICY_COUNT: string = 'policyCount';
    public static readonly TEMPLATE_LOCATION: string = 'templateLocation';
    public static readonly FIELDS: string = 'fields';
    public static readonly REMARKS: string = 'remarks';
    public static readonly REQUEST_TYPE: string = 'requestType';
    public static readonly CLIENT_TO_ADVISOR: string = 'clientToAdvisor';
    public static readonly ADVISOR_TO_CLIENT: string = 'advisorToClient';
    public static readonly MAP_ID: string = 'mapId';
    public static readonly HTML_DOC: string = 'htmlDoc';
    public static readonly CHECKED_VALUE: string = 'checked';
    public static readonly UNCHECKED_VALUE: string = 'unchecked';
    public static readonly SECTION: string = 'section';

    public static readonly DEFAULT_CURRENCY: string = 'SGD';
    public static readonly STATEMENT_DELETE_FLAG: string = 'statementDeleteFlag';
    public static readonly ACCOUNT_DETAILS: string = 'accountDetails';

    public static readonly PDF_FILE_HEAD = 'data:application/pdf;base64,';
    public static readonly XML_FILE_HEAD = 'data:application/xml;base64,';
    public static readonly EXCEL_FILE_HEAD = 'data:application/xlsx;base64,';
    public static readonly CSV_FILE_HEAD = 'data:application/csv;base64,';
    public static readonly JSON_FILE_HEAD = 'data:application/json;base64,';

    // Ph no
    public static readonly PHONE_TYPE = 'type';
    public static readonly COUNTRY_CODE = 'countryCode';
    public static readonly AREA_CODE = 'areaCode';
    public static readonly NUMBER: string = 'number';

    // address
    public static readonly ADDRESS_TYPE: string = 'addressType';
    public static readonly UNIT_NO: string = 'unitNumber';
    public static readonly ADDRESS1: string = 'address1';
    public static readonly ADDRESS2: string = 'address2';
    public static readonly CITY: string = 'city';
    public static readonly STATE: string = 'state';
    public static readonly COUNTRY: string = 'country';
    public static readonly PIN_CODE: string = 'pinCode';

    public static readonly ACTIVE: string = 'active';
    public static readonly ADVISOR_CLIENT_MAP_ID: string = 'advisorClientMapId';
    public static readonly ID_NO: string = 'idNo';

    public static readonly FREQUENCY: string = 'frequency';
    public static readonly FREQUENCY_MONTHLY: string = 'monthly';
    public static readonly FREQUENCY_QUARTERLY: string = 'quarterly';
    public static readonly FREQUENCY_HALF_YEARLY: string = 'half yearly';
    public static readonly FREQUENCY_YEARLY: string = 'yearly';

    // dropdown types
    public static readonly LIST: string = 'list';
    public static readonly DROPDOWN_STATUS_TYPE: string = 'STATUS_TYPE';
    public static readonly DROPDOWN_TYPE: string = 'dropdownType';
    public static readonly DROPDOWN_LIST: string = 'list';
    public static readonly DROPDOWN_PHONE: string = 'PHONE_TYPE';
    public static readonly DROPDOWN_ADDRESS: string = 'ADDRESS_TYPE';
    public static readonly DROPDOWN_POLICY_TYPE: string = 'POLICY_TYPE';
    public static readonly DROPDOWN_POLICY_PLAN_TYPE: string = 'POLICY_PLAN_TYPE';

    // lists
    public static readonly ADDRESS_LIST: string = 'addresses';
    public static readonly PHONE_NUMBER_LIST: string = 'phoneNumbers';

    public static readonly FIELD_NAME: string = 'fieldName';
    public static readonly FIELD_ID: string = 'fieldId';
    public static readonly FIELD_OLD_VALUE: string = 'oldValue';
    public static readonly EDITED: string = 'edited';
    public static readonly EDITED_BY: string = 'editedBy';

    /** @ignore */
    constructor(parameters) {  }
}
