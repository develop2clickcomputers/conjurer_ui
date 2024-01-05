/**
 * Client constants class
 */
export class ClientConstant {

    public static readonly CLIENT_TYPE: string = 'clientType';
    public static readonly CLIENT_TYPE_INDIVIDUAL: string = 'individual';
    public static readonly CLIENT_TYPE_BUSINESS: string = 'business';
    public static readonly CLIENT_NAME: string = 'clientName';
    public static readonly CLIENT_ID: string = 'clientId';
    public static readonly CLIENT_DOB: string = 'dob';
    public static readonly CLIENT_GENDER: string = 'gender';
    public static readonly CLIENT_NATIONALITY: string = 'nationality';
    public static readonly CLIENT_ETHNICITY: string = 'ethnicity';
    public static readonly CLIENT_MARTIAL_STATUS: string = 'martialStatus';
    public static readonly CLIENT_COMPANY: string = 'company';
    public static readonly CLIENT_OCCUPATION: string = 'occupation';
    public static readonly CLIENT_JOB_TITLE: string = 'jobTitle';
    public static readonly CLIENT_POSTAL_CODE: string = 'postalCode';
    public static readonly CLIENT_PEP: string = 'pep';
    public static readonly CLIENT_ACCREDITED_INVESTOR: string = 'accreditedInvestor';
    public static readonly CLIENT_CKA: string = 'cka';

    public static readonly CLIENT_CONSENT: string = 'consent';
    public static readonly CLIENT_CALL: string = 'phCall';
    public static readonly CLIENT_SMS: string = 'sms';
    public static readonly CLIENT_FAX: string = 'fax';
    public static readonly CLIENT_WITHDRAW_CONSENT_DATE: string = 'withdrawConsentDate';
    public static readonly CLIENT_NO_CONSENT: string = 'noConsent';
    public static readonly CLIENT_DO_NOT_CALL: string = 'doNotCallClient';
    public static readonly CLIENT_DO_NOT_SMS: string = 'doNotSMSClient';
    public static readonly CLIENT_DO_NOT_FAX: string = 'doNotFaxClient';
    public static readonly CLIENT_SELECTED_CLIENT: string = 'selectedClient';

    public static readonly CLIENT_PER_UNIT_NO: string = 'per_unit_no';
    public static readonly CLIENT_ADDRESS1: string = 'per_address1';
    public static readonly CLIENT_ADDRESS2: string = 'per_address2';
    public static readonly CLIENT_PER_CITY: string = 'per_city';
    public static readonly CLIENT_PER_STATE: string = 'per_state';
    public static readonly CLIENT_PER_COUNTRY: string = 'per_country';
    public static readonly CLIENT_PER_PIN_CODE: string = 'per_pin_code';
    public static readonly CLIENT_PER_CORRESS_SAME: string = 'per_corres_same';
    public static readonly CLIENT_CORRES_UNIT_NO: string = 'corres_unit_no';
    public static readonly CLIENT_CORRES_ADDRESS1: string = 'corres_address1';
    public static readonly CLIENT_CORRES_ADDRESS2: string = 'corres_address2';
    public static readonly CLIENT_CORRES_CITY: string = 'corres_city';
    public static readonly CLIENT_CORRES_STATE: string = 'corres_state';
    public static readonly CLIENT_CORRES_COUNTRY: string = 'corres_country';
    public static readonly CLIENT_CORRES_PIN_CODE: string = 'corres_pin_code';

    public static readonly CLIENT_EMAIL: string = 'email';

    public static readonly CLIENT_MOBILE: string = 'mobile';
    public static readonly CLIENT_HOME: string = 'home';
    public static readonly CLIENT_WORK: string = 'workNo';

    public static readonly CLIENT_ADVISOR_NAME: string = 'advisorName';
    public static readonly CLIENT_REMARKS: string = 'remarks';

    // Identity Details
    public static readonly IDENTITY_TYPE: string = 'identityType';
    public static readonly COUNTRY_OFF_ISSUANCE: string = 'countryOfIssuance';
    public static readonly ID_NO: string = 'idNo';

    // business
    public static readonly CLIENT_BUSN_REGD_UNIT_NO = 'regd_unit_no';
    public static readonly CLIENT_BUSN_REGD_ADDRESS1 = 'regd_address1';
    public static readonly CLIENT_BUSN_REGD_ADDRESS2 = 'regd_address2';
    public static readonly CLIENT_BUSN_REGD_CITY = 'regd_city';
    public static readonly CLIENT_BUSN_REGD_STATE = 'regd_state';
    public static readonly CLIENT_BUSN_REGD_COUNTRY = 'regd_country';
    public static readonly CLIENT_BUSN_REGD_PIN_CODE = 'regd_pin_code';
    public static readonly CLIENT_BUSN_REGD_PER_CORRES_SAME = 'per_corres_same';
    public static readonly CLIENT_BUSN_BRANCH_UNIT_NO = 'branch_unit_no';
    public static readonly CLIENT_BUSN_BRANCH_ADDRESS1 = 'branch_address1';
    public static readonly CLIENT_BUSN_BRANCH_ADDRESS2 = 'branch_address2';
    public static readonly CLIENT_BUSN_BRANCH_CITY = 'branch_city';
    public static readonly CLIENT_BUSN_BRANCH_STATE = 'branch_state';
    public static readonly CLIENT_BUSN_BRANCH_COUNTRY = 'branch_country';
    public static readonly CLIENT_BUSN_BRANCH_PIN_CODE = 'branch_pin_code';

    public static readonly PRIMARY_CONTACT: string = 'primary_contact';
    public static readonly BUSINESS_INDUSTRY: string = 'businessIndustry';
    public static readonly BUSINESS_CLASS: string = 'businessClass';

    public static readonly BUSINESS_PHNO_WORK1: string = 'work1';
    public static readonly BUSINESS_PHNO_WORK2: string = 'work2';
    public static readonly BUSINESS_PHNO_WORK3: string = 'work3';

    // registration details
    public static readonly AGENCY: string = 'agency';
    public static readonly SEGEMENT: string = 'segment';
    public static readonly REG_NO: string = 'registrationNumber';

    // household
    public static readonly CONTACT_NAME: string = 'contact_name';
    public static readonly HOUSEHOLD_NAME: string = 'householdName';
    public static readonly TOTAL_POLICY_PREMIUM: string = 'total_policy_premium';
    public static readonly HOUSEHOLD_SPOUSE: string = 'spouse';
    public static readonly HOUSEHOLD_HEAD: string = 'head';
    public static readonly HOUSEHOLD_ID: string = 'householdId';
    public static readonly PREMIUM: string = 'premium';
    public static readonly MEMBER_NAME: string = 'memberName';
    public static readonly RELATIONSHIP_WITH_HEAD: string = 'relationship';
    public static readonly HOUSEHOLD_DETAIL: string = 'householdDetail';

    // main policy
    public static readonly POLICY_PLAN_ID = 'policyPlanId';
    public static readonly POLICY_PLAN_TERM_ID = 'policyPlanTermId';
    public static readonly POLICY_PREMIUM_NAME = 'premiumName';
    public static readonly POLICY_RIDER_NAME = 'rider';
    public static readonly POLICY_TERM = 'policyTerm';
    public static readonly POLICY_COVER = 'policyCover';
    public static readonly POLICY_CARRIER_NAME = 'carrierName';
    public static readonly POLICY_CARRIER_ABBR = 'carrierAbbr';
    public static readonly POLICY_NAME = 'policyName';
    public static readonly POLICY_TYPE = 'policyType';
    public static readonly POLICY_PLAN_TYPE = 'planType';
    public static readonly POLICY_NUMBER = 'policyNumber';
    public static readonly POLICY_PRODUCT_NAME = 'productName';
    public static readonly POLICY_OPTIONS = 'options';
    public static readonly POLICY_EFFECTIVE_DATE = 'effectiveDate';
    public static readonly POLICY_STATUS = 'status';
    public static readonly POLICY_STATUS_DATE = 'statusDate';
    public static readonly POLICY_MATURITY_DATE = 'maturityDate';
    public static readonly POLICY_CONTACT_NAME = 'contactName';
    public static readonly POLICY_CONTACT_ID = 'contactId';
    public static readonly POLICY_PRIMARY_INSURED = 'primaryInsured';
    public static readonly POLICY_IPP_ADVISORY_GROUP = 'ippAdvisoryGroup';
    public static readonly POLICY_TRANSFER_OUT_FROM_IPP = 'transferOutFromIpp';
    public static readonly POLICY_KEYWORDS = 'keywords';
    public static readonly POLICY_PURPOSE = 'purpose';
    public static readonly POLICY_PAY_METHOD = 'payMethod';
    public static readonly POLICY_PREMIUM_MODE = 'premiumMode';
    public static readonly POLICY_PREMIUM = 'premium';
    public static readonly POLICY_LOADING_PREMIUM = 'loadingPremium';
    public static readonly POLICY_COMM_MODAL_PREMIUM = 'commModalPremium';
    public static readonly POLICY_ANNUALIZE_PREMIUM = 'annualizedPremium';
    public static readonly POLICY_COMM_ANNUALIZE_PREMIUM = 'commAnnualizedPremium';
    public static readonly POLICY_RIDERS_ANNUALIZE_PREMIUM = 'ridersAnnualizedPremium';
    public static readonly POLICY_ANNUALIZE_PREM_WITH_RIDER = 'annualizedPremWithRider';
    public static readonly POLICY_BASIC_FACE = 'basicFace';
    public static readonly POLICY_SUBJECT_TO_BSC = 'subjectToBsc';
    public static readonly POLICY_BSC_SCORE = 'bsc_score';
    public static readonly POLICY_BSC_REVISED_SCORE = 'bscRevisedScore';
    public static readonly POLICY_QUARTER_OF_THE_YEAR = 'quarterOfTheYear';
    public static readonly POLICY_REMARKS = 'policy_remarks';
    public static readonly POLICY_TRANSACTION_TYPE = 'transactionType';
    public static readonly POLICY_AMOUNT = 'amount';
    public static readonly POLICY_TRANSACTION_DATE = 'transactionDate';
    public static readonly POLICY_TRANSACTION_ID = 'transactionId';
    public static readonly POLICY_CLIENT_CHOICE = 'clientChoice';
    public static readonly POLICY_AUA = 'aua';
    public static readonly POLICY_IND_RETAIN_REMARKS = 'indRetainRemarks';
    public static readonly POLICY_IND_RELEASED_REMARKS = 'indReleasedRemarks';
    public static readonly POLICY_IND_RETAIN_OR_RELEASED_AMOUNT = 'indRetainOrReleasedAmount';
    public static readonly REMARKS = 'remarks';

    public static readonly POLICY_PRIMARY_ADVISOR = 'advisor';
    public static readonly POLICY_TOTAL_PREMIUM = 'totalPremium';
    public static readonly LOADING_PREMIUM = 'loadingPremium';
    public static readonly TARGET_PREMIUM = 'targetPremium';
    public static readonly TARGET_PREMIUM_APPLICABLE = 'targetPremiumApplicable';
    public static readonly TARGET_PREMIUM_FREQUENCY = 'targetPremiumFrequency';
    public static readonly INDEMINITY_APPLICABLE = 'indeminityApplicable';
    public static readonly INSTALMENT_SCHEDULE_LIST: string = 'installmentSchedule';
    public static readonly EMPLOYEE_GR_BANDING_LIST: string = 'employeeGRBandings';
    public static readonly COMMISSION_LIST: string = 'commissionList';

    public static readonly NO_OF_PREMIUMS: string = 'numberOfPremiums';
    public static readonly NO_OF_PREMIUM_PAID: string = 'numberOfPremiumPaid';
    public static readonly EFFECTIVE_DATE: string = 'effectiveDate';
    public static readonly ADVISOR_ROLE: string = 'advisorRole';
    public static readonly COMMISSION_PERCENT: string = 'commissionPercent';
    public static readonly BUYER_TYPE: string = 'buyerType';
    public static readonly BUYER_ID: string = 'buyerId';
    public static readonly INSURED_TYPE: string = 'insuredType';
    public static readonly INSURED_ID: string = 'insuredId';
    public static readonly ADVISORY_GROUP_ID: string = 'advisoryGroupId';
    public static readonly PREMIUM_FREQUENCY: string = 'premiumFrequency';
    public static readonly BASIC_FACE_VALUE: string = 'basicFaceValue';
    public static readonly BSC_APPLIED: string = 'bscApplied';
    public static readonly DEATH: string = 'death';
    public static readonly PERMANENT_DISABLITY: string = 'permanentDisability';
    public static readonly CRITICAL_ILLNESS: string = 'criticalIllness';
    public static readonly ACCIDENTAL_DEATH: string = 'accidentalDeath';
    public static readonly POLICY_PLAN_RIDER_TERM_ID: string = 'policyPlanRiderTermId';

    public static readonly DEATH_CURRENCY: string = 'deathCurrency';
    public static readonly PERMANENT_DISABLITY_CURRENCY: string = 'permanentDisabilityCurrency';
    public static readonly CRITICAL_ILLNESS_CURRENCY: string = 'criticalIllnessCurrency';
    public static readonly ACCIDENTAL_DEATH_CURRENCY: string = 'accidentalDeathCurrency';
    public static readonly PREMIUM_CURRENCY: string = 'premiumCurrency';
    public static readonly LOADING_PREMIUM_CURRENCY: string = 'loadingPremiumCurrency';

    public static readonly ALL_ADVISOR_LIST: string = 'allAdvisors';
    public static readonly PRIMARY_ADVISOR_LIST: string = 'primaryAdvisors';
    public static readonly POLICY_PREMIUM_LIST: string = 'policyPremiums';
    public static readonly RIDER_PREMIUMS_LIST: string = 'riderPremiums';
    public static readonly POLICY_PLAN_RIDER_LIST: string = 'policyPlanriders';
    public static readonly RIDER_PREMIUM_LIST: string = 'riderPremium';
    public static readonly INSURED_LIST: string = 'insured';

    /** @ignore */
    constructor() {  }
}
