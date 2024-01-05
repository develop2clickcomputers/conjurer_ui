/** Production option object class */
interface ProductOptions {
    premium_term: string;
    years: number;
    yearsTo: number;
    editable_mode: boolean;
    show_buttons: boolean;
}

/** Policy information object */
export interface PolicyInformation {
    carrier_name: string;
    product_name: string;
    product_options: ProductOptions[];
    type: string;
    plan_type: string;
    effective_date: string;
    expiration_date: string;
    ipp_approved: string;
}

/** Policy information list */
export const policies: PolicyInformation[] = [
    {
        carrier_name: 'carrier',
        product_name: 'product',
        product_options: [
            {
                premium_term: 'term1',
                years: 2009,
                yearsTo: 2010,
                editable_mode: false,
                show_buttons: true
            },
            {
                premium_term: 'term2',
                years: 3028,
                yearsTo: 3029,
                editable_mode: false,
                show_buttons: true
            }

        ],
        type: 'Life Insurance',
        plan_type: 'plan_type',
        effective_date: '10-12-1994',
        expiration_date: '10-12-1998',
        ipp_approved: 'yes'
    }
];

/** Type values */
export const typeValue = [
    {
        key: 'Life Insurance', value: 'Life Insurance'
    },
    {
        key: 'Life Insurance1', value: 'Life Insurance1'
    }
];

/** Plan type values */
export const planTypeValue = [
    {
        key: 'plan_type', value: 'plan_type'
    },
    {
        key: 'plan_type1', value: 'plan_type1'
    }
];

/** @ignore */
export const riderList: any[] = [
    {
        'id': 1,
        'type': 'Critical Illness'
    },
    {
        'id': 2,
        'type': 'Accidental Death'
    },
    {
        'id': 3,
        'type': 'Child Protection'
    }
];
