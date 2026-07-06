/**
 * Xero+ OAuth2 Credentials for n8n
 * 
 * This credential extends the functionality of the official n8n Xero credentials
 * Original Xero credentials: https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/credentials/XeroOAuth2Api.credentials.ts
 * 
 */

import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

// Xero migrated the broad accounting scopes to granular per-resource scopes.
// Broad scopes (accounting.transactions, accounting.reports.read) are deprecated and
// only usable by connections created before 29 April 2026 (removed by Sep 2027).
// See: https://developer.xero.com/documentation/guides/oauth2/scopes/
const scopes = [
	'offline_access',

	// Accounting — transactional (granular replacements for the deprecated `accounting.transactions`)
	'accounting.invoices',
	'accounting.payments',
	'accounting.banktransactions', // also covers Bank Transfers
	'accounting.manualjournals',

	// Accounting — core (not deprecated; still valid as-is)
	'accounting.settings', // Accounts, Organisation, Tax Rates, etc.
	'accounting.contacts',
	'accounting.attachments',
	'accounting.budgets.read',

	// Accounting — reports (granular replacements for the deprecated `accounting.reports.read`)
	'accounting.reports.aged.read',
	'accounting.reports.balancesheet.read',
	'accounting.reports.banksummary.read',
	'accounting.reports.budgetsummary.read',
	'accounting.reports.executivesummary.read',
	'accounting.reports.profitandloss.read',
	'accounting.reports.trialbalance.read',
	'accounting.reports.taxreports.read',
	'accounting.reports.tenninetynine.read', // 1099

	// Files
	'files',
];

export class XeroPlusOAuth2Api implements ICredentialType {
	name = 'xeroplusOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Xero+ OAuth2 API';

	icon: Icon = 'file:xero-dark-logo.svg';

	// eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-not-http-url
	documentationUrl = 'xero';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://login.xero.com/identity/connect/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://identity.xero.com/connect/token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: scopes.join(' '),
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}
