/**
 * Rider commission object class
 */
export interface RiderCommission {
    carrier_name: string;
    product_name: string;
    rates: any[];
    effective_date: string;
    expiration_date: string;
    plan_type: string;
    rider: string;
}

/** Rider commission list class */
export const riderCommissions: RiderCommission[] = [
    {
        carrier_name: 'Carrier ABC Singapore Ltd',
        product_name: 'ABC',
        rates: [{
            years: '01',
            effective: '01',
            age: '02',
            face: 'All',
            state: 'State1',
            option: 'premium term',
            commission: '41.21%',
            points: '2',
            editable_mode: false,
            show_buttons: true
        }],
        effective_date: '01-02-2017',
        expiration_date: '01-07-2017',
        plan_type: 'Term Life',
        rider: 'Product',
    }
]

/** Type value */
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
