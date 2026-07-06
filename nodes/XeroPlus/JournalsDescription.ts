import type { INodeProperties } from 'n8n-workflow';

export const journalsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['journals'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a system-generated journal (general ledger entry)',
				action: 'Get a journal',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many system-generated journals (general ledger entries)',
				action: 'Get many journals',
			},
		],
		default: 'getAll',
	},
];

export const journalsFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                journals:get                                */
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
				resource: ['journals'],
				operation: ['get'],
			},
		},
		required: true,
	},
	{
		displayName: 'Journal ID or Number',
		name: 'journalId',
		type: 'string',
		default: '',
		description:
			'Identifier of the journal: either the JournalID (GUID) or the JournalNumber (integer)',
		displayOptions: {
			show: {
				resource: ['journals'],
				operation: ['get'],
			},
		},
		required: true,
	},

	/* -------------------------------------------------------------------------- */
	/*                                journals:getAll                             */
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
				resource: ['journals'],
				operation: ['getAll'],
			},
		},
		required: true,
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['journals'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		// Xero returns up to 100 journals per request, so 100 = a single API call
		// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
		default: 100,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['journals'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['journals'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'If-Modified-Since',
				name: 'If-Modified-Since',
				type: 'dateTime',
				default: '',
				description: 'Only return journals created or modified since this timestamp',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				description:
					'Only return journals with a JournalNumber greater than this value. Useful to resume a previous retrieval.',
				typeOptions: {
					minValue: 0,
				},
			},
			{
				displayName: 'Payments Only',
				name: 'paymentsOnly',
				type: 'boolean',
				default: false,
				description: 'Whether to return only journals on a cash basis. Journals are returned on an accrual basis by default.',
			},
		],
	},
];
