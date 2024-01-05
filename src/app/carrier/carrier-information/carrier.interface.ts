/** Phone number */
export interface PhoneNumbers {
    country_code: string;
    area_code: string;
    number: number,
    editable_mode: boolean;
    show_buttons: boolean;
}

/**
 * Address
 */
export interface Address {
    unit_no: any;
    address1: any;
    address2: any;
    city: string;
    state: string;
    country: string;
    pin_code: number;
    editable_mode: boolean;
    show_buttons: boolean;
}

/** Contact */
export interface Contact {
    id: number;
    carrier_name: string;
    carrier_abbr: string;
    email: any;
    addresses: Address[];
    phone_numbers: PhoneNumbers[];
}

/** Contact list */
export const contacts: Contact[] = [
    {
        id: 1,
        carrier_name: 'abc',
        carrier_abbr: 'adc',
        phone_numbers: [
            {
                country_code: 'snd',
                area_code: 'ddf',
                number: 123,
                editable_mode: false,
                show_buttons: true
            },
            {
                country_code: 'snd',
                area_code: 'ddf',
                number: 123,
                editable_mode: false,
                show_buttons: true
            }
        ],
        email: 'durgesh@g.com',
        addresses: [
            {
                unit_no: '123',
                address1: 'abc',
                address2: 'cbd',
                city: 'mdmmd',
                state: 'hfhf',
                country: 'India',
                pin_code: 123,
                editable_mode: false,
                show_buttons: true
            },
            {
                unit_no: '465',
                address1: 'ndnd',
                address2: 'cbititd',
                city: 'juj',
                state: 'ioo',
                country: 'Singapore',
                pin_code: 687,
                editable_mode: false,
                show_buttons: true
            }
        ]
    }
];

/** Carrier request */
export const carrierRequest = {
    'userId': '15a1ad45-7070-4baa-ae86-441729e57d48',
    'name': 'AXA1 LIFE',
    'abbreviation': 'AXA1',
    'status': true,
    'carrierAddresses': [
        {
            'type': {
                'type': 'ADDRESS_TYPE',
                'value': 'HOME',
                'displayText': 'HOME'
            },
            'primary': false,
            'address1': 'hinjewadi',
            'address2': '',
            'city': 'pune',
            'state': 'MH',
            'country': 'India',
            'pinCode': '4577011',
            'unitNumber': '',
            'active': true
        },
        {
            'type': {
                'type': 'ADDRESS_TYPE',
                'value': 'OFFICE',
                'displayText': 'OFFICE'
            },
            'primary': true,
            'address1': 'hinjewadi',
            'address2': '',
            'city': 'pune',
            'state': 'MH',
            'country': 'India',
            'pinCode': '4577011',
            'unitNumber': '',
            'active': true
        }
    ],
    'carrierContacts': [
        {
            'type': {
                'type': 'PHONE_NUMBER',
                'value': 'Work',
                'displayText': 'WORK'
            },
            'countryCode': '+91',
            'areaCode': '1100',
            'number': '8109198586',
            'primary': true,
            'active': true
        },
        {
            'type': {
                'type': 'PHONE_NUMBER',
                'value': 'Work',
                'displayText': 'WORK'
            },
            'countryCode': '+91',
            'areaCode': '1100',
            'number': '8109198586',
            'primary': true,
            'active': true
        }
    ],
    'carrierEmails': [
        {
            'email': 'durgesh.kumar@pisight.com',
            'primary': true
        },
        {
            'email': 'durgesh1.kumar@pisight.com',
            'primary': false
        }
    ],
    'carrierContactPerson': [
        {
            'name': 'Durgesh',
            'phoneNumbers': [
                {
                    'countryCode': '+91',
                    'areaCode': '1100',
                    'number': '8109198586',
                    'type': {
                        'type': 'PHONE_NUMBER',
                        'value': 'Work',
                        'displayText': 'WORK'
                    }
                },
                {
                    'countryCode': '+91',
                    'areaCode': '1100',
                    'number': '8109198586',
                    'type': {
                        'type': 'PHONE_NUMBER',
                        'value': 'Office',
                        'displayText': 'OFFICE'
                    }
                }
            ],
            'emails': [
                {
                    'email': 'durgesh.kumar@pisight.com',
                    'primary': true
                },
                {
                    'email': 'durgesh1.kumar@pisight.com',
                    'primary': false
                }
            ],
            'addresses': [
                {
                    'type': {
                        'type': 'ADDRESS_TYPE',
                        'value': 'OFFICE',
                        'displayText': 'OFFICE'
                    },
                    'primary': true,
                    'address1': 'hinjewadi',
                    'address2': '',
                    'city': 'pune',
                    'state': 'MH',
                    'country': 'India',
                    'pinCode': '4577011',
                    'unitNumber': '',
                    'active': true
                }
            ]
        }
    ]
}
