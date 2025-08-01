import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a contact',
				action: 'Create a contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact',
				action: 'Get a contact',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many contacts',
				action: 'Get many contacts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a contact',
				action: 'Update a contact',
			},
		],
		default: 'create',
	},
];

export const contactFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                contact:create                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Organization Name or ID',
		name: 'organizationId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getTenants',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		required: true,
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		description: 'Full name of contact/organisation',
		required: true,
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Account Number',
				name: 'accountNumber',
				type: 'string',
				default: '',
				description: 'A user defined account number',
			},
			{
				displayName: 'Addresses',
				name: 'addressesUi',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Address',
				options: [
					{
						name: 'addressesValues',
						displayName: 'Address',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{
										name: 'PO Box',
										value: 'POBOX',
									},
									{
										name: 'Street',
										value: 'STREET',
									},
								],
								default: 'POBOX',
							},
							{
								displayName: 'Line 1',
								name: 'line1',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Line 2',
								name: 'line2',
								type: 'string',
								default: '',
							},
							{
								displayName: 'City',
								name: 'city',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Region',
								name: 'region',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Postal Code',
								name: 'postalCode',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Attention To',
								name: 'attentionTo',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Bank Account Details',
				name: 'bankAccountDetails',
				type: 'string',
				default: '',
				description: 'Bank account number of contact',
			},
			{
				displayName: 'Contact Number',
				name: 'contactNumber',
				type: 'string',
				default: '',
				description:
					'This field is read only on the Xero contact screen, used to identify contacts in external systems',
			},
			{
				displayName: 'Contact Status',
				name: 'contactStatus',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'ACTIVE',
						description: 'The Contact is active and can be used in transactions',
					},
					{
						name: 'Archived',
						value: 'ARCHIVED',
						description: 'The Contact is archived and can no longer be used in transactions',
					},
					{
						name: 'GDPR Request',
						value: 'GDPRREQUEST',
						description: 'The Contact is the subject of a GDPR erasure request',
					},
				],
				default: 'ACTIVE',
				description: 'Current status of a contact - see contact status types',
			},
			{
				displayName: 'Default Currency',
				name: 'defaultCurrency',
				type: 'string',
				default: '',
				description: 'Default currency for raising invoices against contact',
			},
			{
				displayName: 'Email',
				name: 'emailAddress',
				type: 'string',
				default: '',
				description: 'Email address of contact person (umlauts not supported) (max length = 255)',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name of contact person (max length = 255)',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name of contact person (max length = 255)',
			},
			{
				displayName: 'Phones',
				name: 'phonesUi',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Phone',
				options: [
					{
						name: 'phonesValues',
						displayName: 'Phones',
						values: [
							{
								displayName: 'Type',
								name: 'phoneType',
								type: 'options',
								options: [
									{
										name: 'Default',
										value: 'DEFAULT',
									},
									{
										name: 'DDI',
										value: 'DDI',
									},
									{
										name: 'Mobile',
										value: 'MOBILE',
									},
									{
										name: 'Fax',
										value: 'FAX',
									},
								],
								default: 'DEFAULT',
							},
							{
								displayName: 'Number',
								name: 'phoneNumber',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Area Code',
								name: 'phoneAreaCode',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country Code',
								name: 'phoneCountryCode',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Purchase Default Account Code Name or ID',
				name: 'purchasesDefaultAccountCode',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAccountCodes',
				},
				default: '',
				description:
					'The default purchases account code for contacts. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Sales Default Account Code Name or ID',
				name: 'salesDefaultAccountCode',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAccountCodes',
				},
				default: '',
				description:
					'The default sales account code for contacts. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Skype',
				name: 'skypeUserName',
				type: 'string',
				default: '',
				description: 'Skype user name of contact',
			},
			{
				displayName: 'Tax Number',
				name: 'taxNumber',
				type: 'string',
				default: '',
				description: 'Tax number of contact',
			},
			{
				displayName: 'Xero Network Key',
				name: 'xeroNetworkKey',
				type: 'string',
				default: '',
				description: 'Store XeroNetworkKey for contacts',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                 contact:get                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Organization Name or ID',
		name: 'organizationId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getTenants',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get'],
			},
		},
		required: true,
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get'],
			},
		},
		required: true,
	},
	/* Commented out as Xero does not support this option for the get specific contact operation
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Summary Only',
				name: 'summaryOnly',
				type: 'boolean',
				default: false,
				description:
					'When set to true, this returns lightweight fields, excluding computation-heavy fields from the response, making the API calls quick and efficient.',
			},
		],
	}, */
	/* -------------------------------------------------------------------------- */
	/*                                   contact:getAll                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Organization Name or ID',
		name: 'organizationId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getTenants',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
		required: true,
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Custom Where Clause',
				name: 'customWhere',
				type: 'string',
				default: '',
				description: 'Custom WHERE clause for advanced filtering (e.g., "Name==\\"ABC Limited\\" && EmailAddress==\\"email@example.com\\"")',
				placeholder: 'Name=="ABC Limited" && EmailAddress=="email@example.com"',
			},
			{
				displayName: 'Include Archived',
				name: 'includeArchived',
				type: 'boolean',
				default: false,
				description: 'Whether contacts with a status of ARCHIVED will be included in the response',
			},
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'string',
				placeholder: 'contactID',
				default: '',
				description: 'Order by any element returned',
			},
			// New parameters/options added to the node
			{
				displayName: 'Search Term',
				name: 'searchTerm',
				type: 'string',
				placeholder: '',
				default: '',
				description: 'Search parameter that performs a case-insensitive text search across the fields: Name, FirstName, LastName, ContactNumber, CompanyNumber, EmailAddress',
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				options: [
					{
						name: 'Asc',
						value: 'ASC',
					},
					{
						name: 'Desc',
						value: 'DESC',
					},
				],
				default: 'ASC',
			},
			{
				displayName: 'Summary Only', 
				name: 'summaryOnly',
				type: 'boolean',
				default: false,
				description: 'Whether to return lightweight fields, excluding computation-heavy fields from the response, making the API calls quick and efficient',
			},
			{
				displayName: 'Where',
				name: 'where',
				type: 'string',
				placeholder: 'EmailAddress!=null&&EmailAddress.StartsWith("boom")',
				default: '',
				description:
					'The where parameter allows you to filter on endpoints and elements that don\'t have explicit parameters. <a href="https://developer.xero.com/documentation/api/requests-and-responses#get-modified">Examples Here</a>.',
			},
			{
				displayName: 'Where Filters',
				name: 'whereFilters',
				placeholder: 'Add Filter',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				description: 'Structured filters for common use cases (optimized fields)',
				options: [
					{
						name: 'filters',
						displayName: 'Filter',
						// eslint-disable-next-line n8n-nodes-base/node-param-fixed-collection-type-unsorted-items
						values: [
							{
								displayName: 'Field',
								name: 'field',
								type: 'options',
								options: [
									{ name: 'Account Number', value: 'AccountNumber' },
									{ name: 'Email Address', value: 'EmailAddress' },
									{ name: 'Name', value: 'Name' },
								],
								default: 'Name',
								description: 'Field to filter on',
							},
							{
								displayName: 'Account Number',
								name: 'accountNumberValue',
								type: 'string',
								default: '',
								description: 'Account number to filter by',
								displayOptions: {
									show: {
										field: ['AccountNumber'],
									},
								},
							},
							{
								displayName: 'Email Address',
								name: 'emailAddressValue',
								type: 'string',
								default: '',
								description: 'Email address to filter by',
								displayOptions: {
									show: {
										field: ['EmailAddress'],
									},
								},
							},
							{
								displayName: 'Name',
								name: 'nameValue',
								type: 'string',
								default: '',
								description: 'Contact name to filter by',
								displayOptions: {
									show: {
										field: ['Name'],
									},
								},
							},
						],
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                contact:update                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Organization Name or ID',
		name: 'organizationId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getTenants',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		required: true,
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		required: true,
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Account Number',
				name: 'accountNumber',
				type: 'string',
				default: '',
				description: 'A user defined account number',
			},
			{
				displayName: 'Addresses',
				name: 'addressesUi',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Address',
				options: [
					{
						name: 'addressesValues',
						displayName: 'Address',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{
										name: 'PO Box',
										value: 'POBOX',
									},
									{
										name: 'Street',
										value: 'STREET',
									},
								],
								default: 'POBOX',
							},
							{
								displayName: 'Line 1',
								name: 'line1',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Line 2',
								name: 'line2',
								type: 'string',
								default: '',
							},
							{
								displayName: 'City',
								name: 'city',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Region',
								name: 'region',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Postal Code',
								name: 'postalCode',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Attention To',
								name: 'attentionTo',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Bank Account Details',
				name: 'bankAccountDetails',
				type: 'string',
				default: '',
				description: 'Bank account number of contact',
			},
			{
				displayName: 'Contact Number',
				name: 'contactNumber',
				type: 'string',
				default: '',
				description:
					'This field is read only on the Xero contact screen, used to identify contacts in external systems',
			},
			{
				displayName: 'Contact Status',
				name: 'contactStatus',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'ACTIVE',
						description: 'The Contact is active and can be used in transactions',
					},
					{
						name: 'Archived',
						value: 'ARCHIVED',
						description: 'The Contact is archived and can no longer be used in transactions',
					},
					{
						name: 'GDPR Request',
						value: 'GDPRREQUEST',
						description: 'The Contact is the subject of a GDPR erasure request',
					},
				],
				default: 'ACTIVE',
				description: 'Current status of a contact - see contact status types',
			},
			{
				displayName: 'Default Currency',
				name: 'defaultCurrency',
				type: 'string',
				default: '',
				description: 'Default currency for raising invoices against contact',
			},
			{
				displayName: 'Email',
				name: 'emailAddress',
				type: 'string',
				default: '',
				description: 'Email address of contact person (umlauts not supported) (max length = 255)',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name of contact person (max length = 255)',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name of contact person (max length = 255)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Full name of contact/organisation',
			},
			{
				displayName: 'Phones',
				name: 'phonesUi',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Phone',
				options: [
					{
						name: 'phonesValues',
						displayName: 'Phones',
						values: [
							{
								displayName: 'Type',
								name: 'phoneType',
								type: 'options',
								options: [
									{
										name: 'Default',
										value: 'DEFAULT',
									},
									{
										name: 'DDI',
										value: 'DDI',
									},
									{
										name: 'Mobile',
										value: 'MOBILE',
									},
									{
										name: 'Fax',
										value: 'FAX',
									},
								],
								default: 'DEFAULT',
							},
							{
								displayName: 'Number',
								name: 'phoneNumber',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Area Code',
								name: 'phoneAreaCode',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country Code',
								name: 'phoneCountryCode',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Purchase Default Account Code Name or ID',
				name: 'purchasesDefaultAccountCode',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAccountCodes',
				},
				default: '',
				description:
					'The default purchases account code for contacts. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Sales Default Account Code Name or ID',
				name: 'salesDefaultAccountCode',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAccountCodes',
				},
				default: '',
				description:
					'The default sales account code for contacts. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Skype',
				name: 'skypeUserName',
				type: 'string',
				default: '',
				description: 'Skype user name of contact',
			},
			{
				displayName: 'Tax Number',
				name: 'taxNumber',
				type: 'string',
				default: '',
				description: 'Tax number of contact',
			},
			{
				displayName: 'Xero Network Key',
				name: 'xeroNetworkKey',
				type: 'string',
				default: '',
				description: 'Store XeroNetworkKey for contacts',
			},
		],
	},
];
