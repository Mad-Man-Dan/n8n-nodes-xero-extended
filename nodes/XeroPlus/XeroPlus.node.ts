import {
	type IExecuteFunctions,
	type IDataObject,
	type ILoadOptionsFunctions,
	type INodeExecutionData,
	type INodePropertyOptions,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
	NodeConnectionType,
	NodeOperationError,
	type IRequestOptions,
} from 'n8n-workflow';

import { contactFields, contactOperations } from './ContactDescription';
import { xeroApiRequest, xeroApiRequestAllItems, transformReport } from './GenericFunctions';
import type { IAddress, IContact, IPhone } from './IContactInterface';
import { invoiceFields, invoiceOperations } from './InvoiceDescription';
import type { IInvoice, ILineItem } from './InvoiceInterface';
import { attachmentsFields, attachmentsOperations } from './AttachmentsDescription';
import { accountsFields, accountsOperations } from './AccountsDescription';
import { organisationFields, organisationOperations } from './OrganisationsDescription';
import { reportFields, reportOperations } from './ReportDescription';
import { banktransactionsFields, banktransactionsOperations } from './BankTransactionsDescription';
import { banktransferFields, banktransferOperations } from './BankTransfersDescription';
import { historyandnotesFields, historyandnotesOperations } from './HistoryandNotesDescription';
import { manualjournalsFields, manualjournalsOperations } from './ManualJournalsDescription';



export class Xeroplus implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Xero +',
		name: 'xeroplus',
		icon: 'file:xero-dark-logo.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Xero API',
		defaults: {
			name: 'Xero +',
		},
		usableAsTool: true,
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'xeroplusOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'accounts',
					},
					{
						name: 'Attachment',
						value: 'attachments',
					},
					{
						name: 'Bank Transaction',
						value: 'banktransactions',
					},
					{
						name: 'Bank Transfer',
						value: 'banktransfers',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'History and Note',
						value: 'historyandnotes',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Manual Journal',
						value: 'manualjournals',
					},
					{
						name: 'Organisation',
						value: 'organisation',
					},
					{
						name: 'Report',
						value: 'report',
					},
				],
				default: 'invoice',
			},
			// ORGANISATION
			...organisationOperations,
			...organisationFields,
			// CONTACT
			...contactOperations,
			...contactFields,
			// INVOICE
			...invoiceOperations,
			...invoiceFields,
			// ACCOUNTS
			...accountsOperations,
			...accountsFields,
			// ATTACHMENTS
			...attachmentsOperations,
			...attachmentsFields,
			// REPORT
			...reportOperations,
			...reportFields,
			// BANK TRANSACTIONS
			...banktransactionsOperations,
			...banktransactionsFields,
			// BANK TRANSFERS
			...banktransferOperations,
			...banktransferFields,
			// HISTORY AND NOTES
			...historyandnotesOperations,
			...historyandnotesFields,
			// MANUAL JOURNALS
			...manualjournalsOperations,
			...manualjournalsFields,
		],
	};

	methods = {
		loadOptions: {
			// Get all the item codes to display them to user so that they can
			// select them easily
			async getItemCodes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const organizationId = this.getCurrentNodeParameter('organizationId');
				const returnData: INodePropertyOptions[] = [];
				const { Items: items } = await xeroApiRequest.call(this, 'GET', '/items', {
					organizationId,
				});
				for (const item of items) {
					const itemName = item.Description;
					const itemId = item.Code;
					returnData.push({
						name: itemName,
						value: itemId,
					});
				}
				return returnData;
			},
			// Get all the account codes to display them to user so that they can
			// select them easily
			async getAccountCodes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const organizationId = this.getCurrentNodeParameter('organizationId');
				const returnData: INodePropertyOptions[] = [];
				const { Accounts: accounts } = await xeroApiRequest.call(this, 'GET', '/Accounts', {
					organizationId,
				});
				for (const account of accounts) {
					const accountName = account.Name;
					const accountId = account.Code;
					returnData.push({
						name: accountName,
						value: accountId,
					});
				}
				return returnData;
			},
			// Get all the tenants to display them to user so that they can
			// select them easily
			async getTenants(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const tenants = await xeroApiRequest.call(
					this,
					'GET',
					'',
					{},
					{},
					'https://api.xero.com/connections',
				);
				for (const tenant of tenants) {
					const tenantName = tenant.tenantName;
					const tenantId = tenant.tenantId;
					returnData.push({
						name: tenantName,
						value: tenantId,
					});
				}
				return returnData;
			},
			// Get all the branding themes to display them to user so that they can
			// select them easily
			async getBrandingThemes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const organizationId = this.getCurrentNodeParameter('organizationId');
				const returnData: INodePropertyOptions[] = [];
				const { BrandingThemes: themes } = await xeroApiRequest.call(
					this,
					'GET',
					'/BrandingThemes',
					{ organizationId },
				);
				for (const theme of themes) {
					const themeName = theme.Name;
					const themeId = theme.BrandingThemeID;
					returnData.push({
						name: themeName,
						value: themeId,
					});
				}
				return returnData;
			},
			// Get all the currencies to display them to user so that they can
			// select them easily
			async getCurrencies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const organizationId = this.getCurrentNodeParameter('organizationId');
				const returnData: INodePropertyOptions[] = [];
				const { Currencies: currencies } = await xeroApiRequest.call(this, 'GET', '/Currencies', {
					organizationId,
				});
				for (const currency of currencies) {
					const currencyName = currency.Code;
					const currencyId = currency.Description;
					returnData.push({
						name: currencyName,
						value: currencyId,
					});
				}
				return returnData;
			},

			// Get bank accounts only (for bank transactions)
			async getBankAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const organizationId = this.getCurrentNodeParameter('organizationId');
				const returnData: INodePropertyOptions[] = [];

				if (!organizationId) {
					return returnData;
				}

				const { Accounts: accounts } = await xeroApiRequest.call(this, 'GET', '/Accounts', { organizationId });

				for (const account of accounts as IDataObject[]) {
					// Only include bank accounts (Type === 'BANK')
					if (account.Type === 'BANK') {
						const name = `${account.Name as string} (${account.Code as string})`;
						const id = account.AccountID as string;
						returnData.push({ name, value: id });
					}
				}

				return returnData;
			},

			// Get contacts from organisation
			async getContacts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const organizationId = this.getCurrentNodeParameter('organizationId');
				const returnData: INodePropertyOptions[] = [];

				if (!organizationId) {
					return returnData;
				}

				const { Contacts: contacts } = await xeroApiRequest.call(this, 'GET', '/Contacts', { organizationId }, { order: 'Name ASC' });

				for (const contact of contacts as IDataObject[]) {
					const name = contact.Name as string;
					const id = contact.ContactID as string;
					returnData.push({ name, value: id });
				}

				return returnData;
			},
			

			/* -------------------------------------------------------------------------- 
  			 This method was commented out due to issues with tracking options not loading
			 correctly. Consistently returns an empty array.                    
   		    -------------------------------------------------------------------------- */

			/*
			// Get all the tracking categories to display them to user so that they can select them easily
			async getTrackingCategories(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {

				const organizationId = this.getCurrentNodeParameter('organizationId') as string;
				const returnData: INodePropertyOptions[] = [];

				// Hit Xero only if we don’t already have the data
				let categories = (this as unknown as { _trackingCache?: IDataObject[] })._trackingCache;

				if (!categories) {
					const { TrackingCategories } = await xeroApiRequest.call(
						this,
						'GET',
						'/TrackingCategories',
						{ organizationId },
					);

					// Keep the raw list in memory – it survives during the node-edit session
					(this as unknown as { _trackingCache: IDataObject[] })._trackingCache = TrackingCategories;
					categories = TrackingCategories;
				}

				// Build the dropdown
				// If no categories were returned, simply return the empty array
				if (!categories) return returnData;
				// Populate and return the dropdown list
				for (const c of categories) {
					returnData.push({
						name: c.Name as string,
						value: c.TrackingCategoryID as string,
					});
				}
				return returnData;
			},

			// 2)  Tracking options  ───────────────────────────────────────────────────
			async getTrackingOptions(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {

				const organizationId = this.getCurrentNodeParameter('organizationId') as string;
				const returnData: INodePropertyOptions[] = [];
				let trackingCategoryId: string | undefined;
				try {
					trackingCategoryId = this.getCurrentNodeParameter('/name') as string;
				} catch {}
				if (!trackingCategoryId) {
					try {
						trackingCategoryId = this.getCurrentNodeParameter('name') as string;
					} catch {}
				}

				if (!trackingCategoryId) {
					return returnData;
				}

				// Use the cache from step 1
				let categories = (this as unknown as { _trackingCache?: IDataObject[] })._trackingCache;

				// If the user opened the “Option” list first (rare) we won’t have a cache yet
				if (!categories) {
					const response = await xeroApiRequest.call(
						this,
						'GET',
						'/TrackingCategories',
						{ organizationId },
						{ TrackingCategoryID: trackingCategoryId },
					);
					categories = response.TrackingCategories;
				}

				const category = categories!.find(
					(c) => c.TrackingCategoryID === trackingCategoryId,
				);

				if (!category || !category.Options) return [];

				// Build the dropdown from the cached options
				return (category.Options as IDataObject[]).map((o) => ({
					name: o.Name as string,
					value: o.Name as string,   // Xero expects the name, not the GUID, in the payload
				}));
			},
			*/
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		const qs: IDataObject = {};
		let responseData;
		for (let i = 0; i < length; i++) {
			try {
				const resource = this.getNodeParameter('resource', 0);
				const operation = this.getNodeParameter('operation', 0);
				//https://developer.xero.com/documentation/api/invoices	

				// ORGANISATION
				if (resource === 'organisation') {
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						responseData = await xeroApiRequest.call(this, 'GET', '/Organisation', { organizationId });
						responseData = responseData.Organisations;
					}
					if (operation === 'getAll') {
						responseData = await xeroApiRequest.call(this, 'GET', '', {}, {}, 'https://api.xero.com/connections');
						responseData = responseData;
					}
					if (operation === 'getUsers') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const headers: IDataObject = {};

						if (options.orderBy) {
							qs.order = `${options.orderBy} ${options.sortOrder ?? 'ASC'}`;
						}

						// Where clause handling
						let whereClause = '';
						
						// Use custom where if provided, otherwise build from filters
						if (options.customWhere) {
							whereClause = options.customWhere as string;
						} else if (options.whereFilters) {
							const filters = (options.whereFilters as IDataObject).filters as IDataObject[];
							if (filters && filters.length > 0) {
								const whereParts: string[] = [];
								for (const filter of filters) {
									const field = filter.field as string;
									
									switch (field) {
										case 'EmailAddress':
											if (filter.emailAddressValue) {
												whereParts.push(`EmailAddress=="${filter.emailAddressValue}"`);
											}
											break;
										case 'FirstName':
											if (filter.firstNameValue) {
												whereParts.push(`FirstName=="${filter.firstNameValue}"`);
											}
											break;
										case 'LastName':
											if (filter.lastNameValue) {
												whereParts.push(`LastName=="${filter.lastNameValue}"`);
											}
											break;
										case 'IsSubscriber':
											if (filter.isSubscriberValue !== undefined) {
												whereParts.push(`IsSubscriber==${filter.isSubscriberValue}`);
											}
											break;
										case 'OrganisationRole':
											if (filter.organisationRoleValue) {
												whereParts.push(`OrganisationRole=="${filter.organisationRoleValue}"`);
											}
											break;
									}
								}
								whereClause = whereParts.join(' && ');
							}
						}
						
						if (whereClause) {
							qs.where = whereClause;
						}

						// Handler for If-Modified-Since header
						if (options['If-Modified-Since']) {
							headers['If-Modified-Since'] = options['If-Modified-Since'] as string;
						}

						responseData = await xeroApiRequest.call(
							this,
							'GET',
							'/Users',
							{ organizationId },
							qs,
							undefined,
							headers,
						);
						responseData = responseData.Users;
					}
				}

				// INVOICES
				if (resource === 'invoice') {
					if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const type = this.getNodeParameter('type', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const contactId = this.getNodeParameter('contactId', i) as string;
						const lineItemsValues = (this.getNodeParameter('lineItemsUi', i) as IDataObject)
							.lineItemsValues as IDataObject[];

						const body: IInvoice = {
							organizationId,
							Type: type,
							Contact: { ContactID: contactId },
						};

						if (lineItemsValues) {
							const lineItems: ILineItem[] = [];
							for (const lineItemValue of lineItemsValues) {
								const lineItem: ILineItem = {
									Tracking: [],
								};
								lineItem.AccountCode = lineItemValue.accountCode as string;
								lineItem.Description = lineItemValue.description as string;
								lineItem.DiscountRate = lineItemValue.discountRate as string;
								lineItem.ItemCode = lineItemValue.itemCode as string;
								lineItem.LineAmount = lineItemValue.lineAmount as string;
								lineItem.Quantity = (lineItemValue.quantity as number).toString();
								lineItem.TaxAmount = lineItemValue.taxAmount as string;
								lineItem.TaxType = lineItemValue.taxType as string;
								lineItem.UnitAmount = lineItemValue.unitAmount as string;
								// if (lineItemValue.trackingUi) {
								// 	//@ts-ignore
								// 	const { trackingValues } = lineItemValue.trackingUi as IDataObject[];
								// 	if (trackingValues) {
								// 		for (const trackingValue of trackingValues) {
								// 			const tracking: IDataObject = {};
								// 			tracking.Name = trackingValue.name as string;
								// 			tracking.Option = trackingValue.option as string;
								// 			lineItem.Tracking!.push(tracking);
								// 		}
								// 	}
								// }
								lineItems.push(lineItem);
							}
							body.LineItems = lineItems;
						}

						if (additionalFields.brandingThemeId) {
							body.BrandingThemeID = additionalFields.brandingThemeId as string;
						}
						if (additionalFields.currency) {
							body.CurrencyCode = additionalFields.currency as string;
						}
						if (additionalFields.currencyRate) {
							body.CurrencyRate = additionalFields.currencyRate as string;
						}
						if (additionalFields.date) {
							body.Date = additionalFields.date as string;
						}
						if (additionalFields.dueDate) {
							body.DueDate = additionalFields.dueDate as string;
						}
						if (additionalFields.dueDate) {
							body.DueDate = additionalFields.dueDate as string;
						}
						if (additionalFields.expectedPaymentDate) {
							body.ExpectedPaymentDate = additionalFields.expectedPaymentDate as string;
						}
						if (additionalFields.invoiceNumber) {
							body.InvoiceNumber = additionalFields.invoiceNumber as string;
						}
						if (additionalFields.lineAmountType) {
							body.LineAmountTypes = additionalFields.lineAmountType as string;
						}
						if (additionalFields.plannedPaymentDate) {
							body.PlannedPaymentDate = additionalFields.plannedPaymentDate as string;
						}
						if (additionalFields.reference) {
							body.Reference = additionalFields.reference as string;
						}
						if (additionalFields.sendToContact) {
							body.SentToContact = additionalFields.sendToContact as boolean;
						}
						if (additionalFields.status) {
							body.Status = additionalFields.status as string;
						}
						if (additionalFields.url) {
							body.Url = additionalFields.url as string;
						}

						responseData = await xeroApiRequest.call(this, 'POST', '/Invoices', body);
						responseData = responseData.Invoices;
					}
					if (operation === 'update') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i);

						const body: IInvoice = {
							organizationId,
						};

						if (updateFields.lineItemsUi) {
							const lineItemsValues = (updateFields.lineItemsUi as IDataObject)
								.lineItemsValues as IDataObject[];
							if (lineItemsValues) {
								const lineItems: ILineItem[] = [];
								for (const lineItemValue of lineItemsValues) {
									const lineItem: ILineItem = {
										Tracking: [],
									};
									lineItem.AccountCode = lineItemValue.accountCode as string;
									lineItem.Description = lineItemValue.description as string;
									lineItem.DiscountRate = lineItemValue.discountRate as string;
									lineItem.ItemCode = lineItemValue.itemCode as string;
									lineItem.LineAmount = lineItemValue.lineAmount as string;
									lineItem.Quantity = (lineItemValue.quantity as number).toString();
									lineItem.TaxAmount = lineItemValue.taxAmount as string;
									lineItem.TaxType = lineItemValue.taxType as string;
									lineItem.UnitAmount = lineItemValue.unitAmount as string;
									// if (lineItemValue.trackingUi) {
									// 	//@ts-ignore
									// 	const { trackingValues } = lineItemValue.trackingUi as IDataObject[];
									// 	if (trackingValues) {
									// 		for (const trackingValue of trackingValues) {
									// 			const tracking: IDataObject = {};
									// 			tracking.Name = trackingValue.name as string;
									// 			tracking.Option = trackingValue.option as string;
									// 			lineItem.Tracking!.push(tracking);
									// 		}
									// 	}
									// }
									lineItems.push(lineItem);
								}
								body.LineItems = lineItems;
							}
						}

						if (updateFields.type) {
							body.Type = updateFields.type as string;
						}
						if (updateFields.Contact) {
							body.Contact = { ContactID: updateFields.contactId as string };
						}
						if (updateFields.brandingThemeId) {
							body.BrandingThemeID = updateFields.brandingThemeId as string;
						}
						if (updateFields.currency) {
							body.CurrencyCode = updateFields.currency as string;
						}
						if (updateFields.currencyRate) {
							body.CurrencyRate = updateFields.currencyRate as string;
						}
						if (updateFields.date) {
							body.Date = updateFields.date as string;
						}
						if (updateFields.dueDate) {
							body.DueDate = updateFields.dueDate as string;
						}
						if (updateFields.dueDate) {
							body.DueDate = updateFields.dueDate as string;
						}
						if (updateFields.expectedPaymentDate) {
							body.ExpectedPaymentDate = updateFields.expectedPaymentDate as string;
						}
						if (updateFields.invoiceNumber) {
							body.InvoiceNumber = updateFields.invoiceNumber as string;
						}
						if (updateFields.lineAmountType) {
							body.LineAmountTypes = updateFields.lineAmountType as string;
						}
						if (updateFields.plannedPaymentDate) {
							body.PlannedPaymentDate = updateFields.plannedPaymentDate as string;
						}
						if (updateFields.reference) {
							body.Reference = updateFields.reference as string;
						}
						if (updateFields.sendToContact) {
							body.SentToContact = updateFields.sendToContact as boolean;
						}
						if (updateFields.status) {
							body.Status = updateFields.status as string;
						}
						if (updateFields.url) {
							body.Url = updateFields.url as string;
						}

						responseData = await xeroApiRequest.call(this, 'POST', `/Invoices/${invoiceId}`, body);
						responseData = responseData.Invoices;
					}
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						responseData = await xeroApiRequest.call(this, 'GET', `/Invoices/${invoiceId}`, {
							organizationId,
						});
						responseData = responseData.Invoices;
					}
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const options = this.getNodeParameter('options', i);
						if (options.statuses) {
							qs.statuses = (options.statuses as string[]).join(',');
						}
						if (options.orderBy) {
							qs.order = `${options.orderBy} ${
								options.sortOrder === undefined ? 'DESC' : options.sortOrder
							}`;
						}
						
						// Where clause handling
						let whereClause = '';
						
						// Use custom where if provided, otherwise build from filters
						if (options.customWhere) {
							whereClause = options.customWhere as string;
						} else if (options.whereFilters) {
							const filters = (options.whereFilters as IDataObject).filters as IDataObject[];
							if (filters && filters.length > 0) {
								const whereParts: string[] = [];
								for (const filter of filters) {
									const field = filter.field as string;
									
									switch (field) {
										case 'Status':
											if (filter.statusValue) {
												whereParts.push(`Status=="${filter.statusValue}"`);
											}
											break;
										case 'Contact.ContactID':
											if (filter.contactIdValue) {
												whereParts.push(`Contact.ContactID==guid("${filter.contactIdValue}")`);
											}
											break;
										case 'Contact.Name':
											if (filter.contactNameValue) {
												whereParts.push(`Contact.Name=="${filter.contactNameValue}"`);
											}
											break;
										case 'Contact.ContactNumber':
											if (filter.contactNumberValue) {
												whereParts.push(`Contact.ContactNumber=="${filter.contactNumberValue}"`);
											}
											break;
										case 'Reference':
											if (filter.referenceValue) {
												whereParts.push(`Reference=="${filter.referenceValue}"`);
											}
											break;
										case 'InvoiceNumber':
											if (filter.invoiceNumberValue) {
												whereParts.push(`InvoiceNumber=="${filter.invoiceNumberValue}"`);
											}
											break;
										case 'InvoiceId':
											if (filter.invoiceIdValue) {
												whereParts.push(`InvoiceId==guid("${filter.invoiceIdValue}")`);
											}
											break;
										case 'DateRange':
											const dateFrom = filter.dateFromValue as string;
											const dateTo = filter.dateToValue as string;
											const dateParts: string[] = [];
											if (dateFrom) {
												const fromDate = new Date(dateFrom);
												dateParts.push(`Date>=DateTime(${fromDate.getFullYear()}, ${String(fromDate.getMonth() + 1).padStart(2, '0')}, ${String(fromDate.getDate()).padStart(2, '0')})`);
											}
											if (dateTo) {
												const toDate = new Date(dateTo);
												dateParts.push(`Date<=DateTime(${toDate.getFullYear()}, ${String(toDate.getMonth() + 1).padStart(2, '0')}, ${String(toDate.getDate()).padStart(2, '0')})`);
											}
											if (dateParts.length > 0) {
												whereParts.push(dateParts.join(' && '));
											}
											break;
										case 'Type':
											if (filter.typeValue) {
												whereParts.push(`Type=="${filter.typeValue}"`);
											}
											break;
										case 'AmountDueRange':
											const amountDueMin = filter.amountDueMinValue as number;
											const amountDueMax = filter.amountDueMaxValue as number;
											const amountDueParts: string[] = [];
											if (amountDueMin !== undefined && amountDueMin !== null && !isNaN(amountDueMin)) {
												amountDueParts.push(`AmountDue>=${amountDueMin}`);
											}
											if (amountDueMax !== undefined && amountDueMax !== null && !isNaN(amountDueMax)) {
												amountDueParts.push(`AmountDue<=${amountDueMax}`);
											}
											if (amountDueParts.length > 0) {
												whereParts.push(amountDueParts.join(' && '));
											}
											break;
										case 'AmountPaidRange':
											const amountPaidMin = filter.amountPaidMinValue as number;
											const amountPaidMax = filter.amountPaidMaxValue as number;
											const amountPaidParts: string[] = [];
											if (amountPaidMin !== undefined && amountPaidMin !== null && !isNaN(amountPaidMin)) {
												amountPaidParts.push(`AmountPaid>=${amountPaidMin}`);
											}
											if (amountPaidMax !== undefined && amountPaidMax !== null && !isNaN(amountPaidMax)) {
												amountPaidParts.push(`AmountPaid<=${amountPaidMax}`);
											}
											if (amountPaidParts.length > 0) {
												whereParts.push(amountPaidParts.join(' && '));
											}
											break;
										case 'DueDateRange':
											const dueDateFrom = filter.dueDateFromValue as string;
											const dueDateTo = filter.dueDateToValue as string;
											const dueDateParts: string[] = [];
											if (dueDateFrom) {
												const fromDate = new Date(dueDateFrom);
												dueDateParts.push(`DueDate>=DateTime(${fromDate.getFullYear()}, ${String(fromDate.getMonth() + 1).padStart(2, '0')}, ${String(fromDate.getDate()).padStart(2, '0')})`);
											}
											if (dueDateTo) {
												const toDate = new Date(dueDateTo);
												dueDateParts.push(`DueDate<=DateTime(${toDate.getFullYear()}, ${String(toDate.getMonth() + 1).padStart(2, '0')}, ${String(toDate.getDate()).padStart(2, '0')})`);
											}
											if (dueDateParts.length > 0) {
												whereParts.push(dueDateParts.join(' && '));
											}
											break;
									}
								}
								whereClause = whereParts.join(' && ');
							}
						}
						
						if (whereClause) {
							qs.where = whereClause;
						}
						
						if (options.createdByMyApp) {
							qs.createdByMyApp = options.createdByMyApp as boolean;
						}
						if (options.searchTerm) {
							qs.searchTerm = options.searchTerm as string;
						}

						if (options.summaryOnly) {
							// When summaryOnly is enabled we might exceed the 1,000 item maximum page size.
							// Fetch all pages automatically.
							qs.summaryOnly = true;
							qs.pageSize = 1000; // Xero maximum allowed page size

							responseData = await xeroApiRequestAllItems.call(
								this,
								'Invoices',
								'GET',
								'/Invoices',
								{ organizationId },
								qs,
							);
						} else {
							responseData = await xeroApiRequest.call(
								this,
								'GET',
								'/Invoices',
								{ organizationId },
								qs,
							);
							responseData = responseData.Invoices;
						}
					}
				}

				// ATTACHMENTS
				if (resource === 'attachments') {
					if (operation === 'upload') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = this.getNodeParameter('endpoint', i) as string;
						const guid = this.getNodeParameter('guid', i) as string;
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						let filename = this.getNodeParameter('filename', i, '') as string;

						const item = items[i];
						if (!item.binary || !item.binary[binaryPropertyName]) {
							throw new NodeOperationError(this.getNode(), `Binary property "${binaryPropertyName}" not found on input item ${i}`);
						}

						if (!filename) {
							const binaryInfo = item.binary[binaryPropertyName] as IDataObject;
							filename = (binaryInfo.fileName as string) || 'file';
						}

						// Get the binary data buffer
						let binaryData: Buffer;
						if (this.helpers.getBinaryDataBuffer) {
							binaryData = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
						} else {
							binaryData = Buffer.from((item.binary[binaryPropertyName] as IDataObject).data as string, 'base64');
						}

						const uri = `https://api.xero.com/api.xro/2.0/${endpoint}/${guid}/Attachments/${filename}`;

						const requestOptions: IRequestOptions = {
							method: 'POST',
							body: binaryData,
							uri,
							json: true,
							headers: {
								'Content-Type': 'application/octet-stream',
								Accept: 'application/json',
								'Xero-Tenant-Id': organizationId,
							},
						};

						responseData = await this.helpers.requestOAuth2.call(this, 'xeroplusOAuth2Api', requestOptions);
						// Xero wraps the result in an "Attachments" property
						responseData = (responseData as IDataObject).Attachments ?? responseData;
					}
					if (operation === 'getlist') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = this.getNodeParameter('endpoint', i) as string;
						const guid = this.getNodeParameter('guid', i) as string;

						responseData = await xeroApiRequest.call(
							this,
							'GET',
							`/${endpoint}/${guid}/Attachments`,
							{ organizationId },
						);

						responseData = (responseData as IDataObject).Attachments ?? responseData;
					}
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = this.getNodeParameter('endpoint', i) as string;
						const guid = this.getNodeParameter('guid', i) as string;
						const filename = this.getNodeParameter('filename', i) as string;

						const uri = `https://api.xero.com/api.xro/2.0/${endpoint}/${guid}/Attachments/${filename}`;

						const buffer = (await this.helpers.requestOAuth2.call(this, 'xeroplusOAuth2Api', {
							method: 'GET',
							uri,
							encoding: null, // return Buffer
							json: false,
							headers: {
								'Xero-Tenant-Id': organizationId,
								Accept: 'application/octet-stream',
							},
						})) as Buffer;

						const binaryData = await this.helpers.prepareBinaryData(buffer, filename);
						responseData = { success: true };
						const executionBinary = {
							json: responseData,
							binary: {
								data: binaryData,
							},
						} as INodeExecutionData;

						returnData.push(executionBinary);
						continue;
					}
				}

				// CONTACTS
				if (resource === 'contact') {
					if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const addressesUi = additionalFields.addressesUi as IDataObject;
						const phonesUi = additionalFields.phonesUi as IDataObject;

						const body: IContact = {
							Name: name,
						};

						if (additionalFields.accountNumber) {
							body.AccountNumber = additionalFields.accountNumber as string;
						}

						if (additionalFields.bankAccountDetails) {
							body.BankAccountDetails = additionalFields.bankAccountDetails as string;
						}

						if (additionalFields.contactNumber) {
							body.ContactNumber = additionalFields.contactNumber as string;
						}

						if (additionalFields.contactStatus) {
							body.ContactStatus = additionalFields.contactStatus as string;
						}

						if (additionalFields.defaultCurrency) {
							body.DefaultCurrency = additionalFields.defaultCurrency as string;
						}

						if (additionalFields.emailAddress) {
							body.EmailAddress = additionalFields.emailAddress as string;
						}

						if (additionalFields.firstName) {
							body.FirstName = additionalFields.firstName as string;
						}

						if (additionalFields.lastName) {
							body.LastName = additionalFields.lastName as string;
						}

						if (additionalFields.purchasesDefaultAccountCode) {
							body.PurchasesDefaultAccountCode =
								additionalFields.purchasesDefaultAccountCode as string;
						}

						if (additionalFields.salesDefaultAccountCode) {
							body.SalesDefaultAccountCode = additionalFields.salesDefaultAccountCode as string;
						}

						if (additionalFields.skypeUserName) {
							body.SkypeUserName = additionalFields.skypeUserName as string;
						}

						if (additionalFields.taxNumber) {
							body.taxNumber = additionalFields.taxNumber as string;
						}

						if (additionalFields.xeroNetworkKey) {
							body.xeroNetworkKey = additionalFields.xeroNetworkKey as string;
						}

						if (phonesUi) {
							const phoneValues = phonesUi?.phonesValues as IDataObject[];
							if (phoneValues) {
								const phones: IPhone[] = [];
								for (const phoneValue of phoneValues) {
									const phone: IPhone = {};
									phone.PhoneType = phoneValue.phoneType as string;
									phone.PhoneNumber = phoneValue.phoneNumber as string;
									phone.PhoneAreaCode = phoneValue.phoneAreaCode as string;
									phone.PhoneCountryCode = phoneValue.phoneCountryCode as string;
									phones.push(phone);
								}
								body.Phones = phones;
							}
						}

						if (addressesUi) {
							const addressValues = addressesUi?.addressesValues as IDataObject[];
							if (addressValues) {
								const addresses: IAddress[] = [];
								for (const addressValue of addressValues) {
									const address: IAddress = {};
									address.AddressType = addressValue.type as string;
									address.AddressLine1 = addressValue.line1 as string;
									address.AddressLine2 = addressValue.line2 as string;
									address.City = addressValue.city as string;
									address.Region = addressValue.region as string;
									address.PostalCode = addressValue.postalCode as string;
									address.Country = addressValue.country as string;
									address.AttentionTo = addressValue.attentionTo as string;
									addresses.push(address);
								}
								body.Addresses = addresses;
							}
						}

						responseData = await xeroApiRequest.call(this, 'POST', '/Contacts', {
							organizationId,
							Contacts: [body],
						});
						responseData = responseData.Contacts;
					}
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const contactId = this.getNodeParameter('contactId', i) as string;
						//const options = this.getNodeParameter('options', i);
						//const qsContact: IDataObject = {};
						//if (options.summaryOnly) {
						//	qsContact.summaryOnly = options.summaryOnly as boolean;
						//}
						responseData = await xeroApiRequest.call(
							this,
							'GET',
							`/Contacts/${contactId}`,
							{ organizationId },
						//	qsContact,
						);
						responseData = responseData.Contacts;
					}
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const options = this.getNodeParameter('options', i);
						if (options.statuses) {
							qs.statuses = (options.statuses as string[]).join(',');
						}
						if (options.orderBy) {
							qs.order = `${options.orderBy} ${ options.sortOrder ?? 'DESC' }`;
						}
						
						// Where clause handling
						let whereClause = '';
						
						// Use custom where if provided, otherwise build from filters
						if (options.customWhere) {
							whereClause = options.customWhere as string;
						} else if (options.whereFilters) {
							const filters = (options.whereFilters as IDataObject).filters as IDataObject[];
							if (filters && filters.length > 0) {
								const whereParts: string[] = [];
								for (const filter of filters) {
									const field = filter.field as string;
									
									switch (field) {
										case 'AccountNumber':
											if (filter.accountNumberValue) {
												whereParts.push(`AccountNumber=="${filter.accountNumberValue}"`);
											}
											break;
										case 'EmailAddress':
											if (filter.emailAddressValue) {
												whereParts.push(`EmailAddress=="${filter.emailAddressValue}"`);
											}
											break;
										case 'Name':
											if (filter.nameValue) {
												whereParts.push(`Name=="${filter.nameValue}"`);
											}
											break;
									}
								}
								whereClause = whereParts.join(' && ');
							}
						}
						
						if (whereClause) {
							qs.where = whereClause;
						} else if (options.where) {
							qs.where = options.where;
						}
						
						if (options.createdByMyApp) {
							qs.createdByMyApp = options.createdByMyApp as boolean;
						}
						if (options.searchTerm) {
							qs.searchTerm = options.searchTerm as string;
						}

						if (options.summaryOnly) {
							qs.summaryOnly = true;
							qs.pageSize = 1000; // Xero maximum allowed page size

							responseData = await xeroApiRequestAllItems.call(
								this,
								'Contacts',
								'GET',
								'/Contacts',
								{ organizationId },
								qs,
							);
						} else {
							responseData = await xeroApiRequest.call(
								this,
								'GET',
								'/Contacts',
								{ organizationId },
								qs,
							);
							responseData = responseData.Contacts;
						}
					}
					if (operation === 'update') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const contactId = this.getNodeParameter('contactId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i);
						const addressesUi = updateFields.addressesUi as IDataObject;
						const phonesUi = updateFields.phonesUi as IDataObject;

						const body: IContact = {};

						if (updateFields.accountNumber) {
							body.AccountNumber = updateFields.accountNumber as string;
						}

						if (updateFields.name) {
							body.Name = updateFields.name as string;
						}

						if (updateFields.bankAccountDetails) {
							body.BankAccountDetails = updateFields.bankAccountDetails as string;
						}

						if (updateFields.contactNumber) {
							body.ContactNumber = updateFields.contactNumber as string;
						}

						if (updateFields.contactStatus) {
							body.ContactStatus = updateFields.contactStatus as string;
						}

						if (updateFields.defaultCurrency) {
							body.DefaultCurrency = updateFields.defaultCurrency as string;
						}

						if (updateFields.emailAddress) {
							body.EmailAddress = updateFields.emailAddress as string;
						}

						if (updateFields.firstName) {
							body.FirstName = updateFields.firstName as string;
						}

						if (updateFields.lastName) {
							body.LastName = updateFields.lastName as string;
						}

						if (updateFields.purchasesDefaultAccountCode) {
							body.PurchasesDefaultAccountCode = updateFields.purchasesDefaultAccountCode as string;
						}

						if (updateFields.salesDefaultAccountCode) {
							body.SalesDefaultAccountCode = updateFields.salesDefaultAccountCode as string;
						}

						if (updateFields.skypeUserName) {
							body.SkypeUserName = updateFields.skypeUserName as string;
						}

						if (updateFields.taxNumber) {
							body.taxNumber = updateFields.taxNumber as string;
						}

						if (updateFields.xeroNetworkKey) {
							body.xeroNetworkKey = updateFields.xeroNetworkKey as string;
						}

						if (phonesUi) {
							const phoneValues = phonesUi?.phonesValues as IDataObject[];
							if (phoneValues) {
								const phones: IPhone[] = [];
								for (const phoneValue of phoneValues) {
									const phone: IPhone = {};
									phone.PhoneType = phoneValue.phoneType as string;
									phone.PhoneNumber = phoneValue.phoneNumber as string;
									phone.PhoneAreaCode = phoneValue.phoneAreaCode as string;
									phone.PhoneCountryCode = phoneValue.phoneCountryCode as string;
									phones.push(phone);
								}
								body.Phones = phones;
							}
						}

						if (addressesUi) {
							const addressValues = addressesUi?.addressesValues as IDataObject[];
							if (addressValues) {
								const addresses: IAddress[] = [];
								for (const addressValue of addressValues) {
									const address: IAddress = {};
									address.AddressType = addressValue.type as string;
									address.AddressLine1 = addressValue.line1 as string;
									address.AddressLine2 = addressValue.line2 as string;
									address.City = addressValue.city as string;
									address.Region = addressValue.region as string;
									address.PostalCode = addressValue.postalCode as string;
									address.Country = addressValue.country as string;
									address.AttentionTo = addressValue.attentionTo as string;
									addresses.push(address);
								}
								body.Addresses = addresses;
							}
						}

						responseData = await xeroApiRequest.call(this, 'POST', `/Contacts/${contactId}`, {
							organizationId,
							Contacts: [body],
						});
						responseData = responseData.Contacts;
					}
				}

				// ACCOUNTS
				if (resource === 'accounts') {
					if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const type = this.getNodeParameter('type', i) as string;
						const code = this.getNodeParameter('code', i, '') as string;
						const bankAccountNumber = this.getNodeParameter('bankAccountNumber', i, '') as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							organizationId,
							Name: name,
							Type: type,
						};

						if (code) body.Code = code;
						if (bankAccountNumber) body.BankAccountNumber = bankAccountNumber;

						if (additionalFields.status) body.Status = additionalFields.status as string;
						if (additionalFields.description) body.Description = additionalFields.description as string;
						if (additionalFields.bankAccountType) body.BankAccountType = additionalFields.bankAccountType as string;
						if (additionalFields.currencyCode) body.CurrencyCode = additionalFields.currencyCode as string;
						if (additionalFields.taxType) body.TaxType = additionalFields.taxType as string;
						if (additionalFields.enablePaymentsToAccount !== undefined) body.EnablePaymentsToAccount = additionalFields.enablePaymentsToAccount as boolean;
						if (additionalFields.showInExpenseClaims !== undefined) body.ShowInExpenseClaims = additionalFields.showInExpenseClaims as boolean;

						responseData = await xeroApiRequest.call(this, 'PUT', '/Accounts', body);
						responseData = responseData.Accounts ?? responseData;
					}
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const accountId = this.getNodeParameter('accountId', i) as string;
						responseData = await xeroApiRequest.call(this, 'GET', `/Accounts/${accountId}`, { organizationId });
						responseData = responseData.Accounts;
					}
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const headers: IDataObject = {};

						if (options.orderBy) {
							qs.order = `${options.orderBy} ${options.sortOrder ?? 'DESC'}`;
						}
						
						// Where clause handling //TODO: Possibly revise format later on
						let whereClause = '';
						
						// Use custom where if provided, otherwise build from filters
						if (options.customWhere) {
							whereClause = options.customWhere as string;
						} else if (options.whereFilters) {
							const filters = (options.whereFilters as IDataObject).filters as IDataObject[];
							if (filters && filters.length > 0) {
								const whereParts: string[] = [];
								for (const filter of filters) {
									const field = filter.field as string;
									
									switch (field) {
										case 'Type':
											if (filter.typeValue) {
												whereParts.push(`Type=="${filter.typeValue}"`);
											}
											break;
										case 'Class':
											if (filter.classValue) {
												whereParts.push(`Class=="${filter.classValue}"`);
											}
											break;
										case 'Status':
											if (filter.statusValue) {
												whereParts.push(`Status=="${filter.statusValue}"`);
											}
											break;
										case 'BankAccountType':
											if (filter.bankAccountTypeValue) {
												whereParts.push(`BankAccountType=="${filter.bankAccountTypeValue}"`);
											}
											break;
										case 'TaxType':
											if (filter.taxTypeValue) {
												whereParts.push(`TaxType=="${filter.taxTypeValue}"`);
											}
											break;
										case 'EnablePaymentsToAccount':
											if (filter.enablePaymentsValue) {
												whereParts.push(`EnablePaymentsToAccount==${filter.enablePaymentsValue}`);
											}
											break;
										case 'SystemAccount':
											if (filter.systemAccountValue) {
												whereParts.push(`SystemAccount=="${filter.systemAccountValue}"`);
											}
											break;
										case 'AddToWatchlist':
											if (filter.AddToWatchlist) {
												whereParts.push(`AddToWatchlist==${filter.AddToWatchlist}`);
											}
											break;
									}
								}
								whereClause = whereParts.join(' && ');
							}
						}
						
						if (whereClause) {
							qs.where = whereClause;
						}
						
						if (options.searchTerm) {
							qs.searchTerm = options.searchTerm as string;
						}
						if (options['If-Modified-Since']) {
							headers['If-Modified-Since'] = options['If-Modified-Since'] as string;
						}

						if (options.summaryOnly) {
							qs.summaryOnly = true;
							qs.pageSize = 1000; // Xero maximum allowed page size

							responseData = await xeroApiRequestAllItems.call(
								this,
								'Accounts',
								'GET',
								'/Accounts',
								{ organizationId },
								qs,
								headers,
							);
						} else {
							responseData = await xeroApiRequest.call(
								this,
								'GET',
								'/Accounts',
								{ organizationId },
								qs,
								undefined,
								headers,
							);
							responseData = responseData.Accounts;
						}
					}
					if (operation === 'update') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const accountId = this.getNodeParameter('accountId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							organizationId,
						};

						if (additionalFields.name) body.Name = additionalFields.name as string;
						if (additionalFields.type) body.Type = additionalFields.type as string;
						if (additionalFields.code) body.Code = additionalFields.code as string;
						if (additionalFields.bankAccountNumber) body.BankAccountNumber = additionalFields.bankAccountNumber as string;
						if (additionalFields.status) body.Status = additionalFields.status as string;
						if (additionalFields.description) body.Description = additionalFields.description as string;
						if (additionalFields.bankAccountType) body.BankAccountType = additionalFields.bankAccountType as string;
						if (additionalFields.currencyCode) body.CurrencyCode = additionalFields.currencyCode as string;
						if (additionalFields.taxType) body.TaxType = additionalFields.taxType as string;
						if (additionalFields.enablePaymentsToAccount !== undefined) body.EnablePaymentsToAccount = additionalFields.enablePaymentsToAccount as boolean;
						if (additionalFields.showInExpenseClaims !== undefined) body.ShowInExpenseClaims = additionalFields.showInExpenseClaims as boolean;
						if (additionalFields.AddToWatchlist !== undefined) body.AddToWatchlist = additionalFields.AddToWatchlist as boolean;

						responseData = await xeroApiRequest.call(this, 'POST', `/Accounts/${accountId}`, body);
						responseData = responseData.Accounts ?? responseData;
					}
					if (operation === 'delete') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const accountId = this.getNodeParameter('accountId', i) as string;
						responseData = await xeroApiRequest.call(this, 'DELETE', `/Accounts/${accountId}`, { organizationId });
						responseData = responseData.Accounts;
					}
				}

				// REPORT
				if (resource === 'report') {
					if (operation === 'get1099') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const reportYear = this.getNodeParameter('reportYear', i) as string;
						responseData = await xeroApiRequest.call(this, 'GET', `/Reports/TenNinetyNine`, { organizationId, reportYear });	
						responseData = responseData.Reports;
					}
					if (operation === 'getBalanceSheet') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const queryParams: IDataObject = {};
						
						if (options.date) {
							queryParams.date = options.date as string;
						}
						if (options.periods) {
							queryParams.periods = options.periods as number;
						}
						if (options.timeframe) {
							queryParams.timeframe = options.timeframe as string;
						}
						if (options.trackingOptionID1) {
							queryParams.trackingOptionID1 = options.trackingOptionID1 as string;
						}
						if (options.trackingOptionID2) {
							queryParams.trackingOptionID2 = options.trackingOptionID2 as string;
						}
						if (options.standardLayout) {
							queryParams.standardLayout = options.standardLayout as boolean;
						}
						if (options.paymentsOnly) {
							queryParams.paymentsOnly = options.paymentsOnly as boolean;
						}

						responseData = await xeroApiRequest.call(this, 'GET', `/Reports/BalanceSheet`, { organizationId }, queryParams);
						responseData = responseData.Reports;
						
						// Transform data if formatting is requested
						if (options.formatReport) {
							responseData = transformReport(responseData);
						}
					}
					if (operation === 'getBudgetSummary') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const queryParams: IDataObject = {};
						
						if (options.date) {
							queryParams.date = options.date as string;
						}
						if (options.periods) {
							queryParams.periods = options.periods as number;
						}
						if (options.timeframe) {
							queryParams.timeframe = options.timeframe as string;
						}

						responseData = await xeroApiRequest.call(this, 'GET', `/Reports/BudgetSummary`, { organizationId }, queryParams);
						responseData = responseData.Reports;
						
						// Transform data if formatting is requested
						if (options.formatReport) {
							responseData = transformReport(responseData);
						}
					}
					if (operation === 'getProfitAndLoss') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const queryParams: IDataObject = {};
						
						if (options.fromDate) {
							queryParams.fromDate = options.fromDate as string;
						}
						if (options.toDate) {
							queryParams.toDate = options.toDate as string;
						}
						if (options.periods) {
							queryParams.periods = options.periods as number;
						}
						if (options.timeframe) {
							queryParams.timeframe = options.timeframe as string;
						}
						if (options.trackingCategoryID) {
							queryParams.trackingCategoryID = options.trackingCategoryID as string;
						}
						if (options.trackingOptionID) {
							queryParams.trackingOptionID = options.trackingOptionID as string;
						}
						if (options.trackingCategoryID2) {
							queryParams.trackingCategoryID2 = options.trackingCategoryID2 as string;
						}
						if (options.trackingOptionID2) {
							queryParams.trackingOptionID2 = options.trackingOptionID2 as string;
						}
						if (options.standardLayout) {
							queryParams.standardLayout = options.standardLayout as boolean;
						}
						if (options.paymentsOnly) {
							queryParams.paymentsOnly = options.paymentsOnly as boolean;
						}

						responseData = await xeroApiRequest.call(this, 'GET', `/Reports/ProfitAndLoss`, { organizationId }, queryParams);
						responseData = responseData.Reports;
						
						// Transform data if formatting is requested
						if (options.formatReport) {
							responseData = transformReport(responseData);
						}
					}	
					if (operation === 'getTrialBalance') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const queryParams: IDataObject = {};
						
						if (options.date) {
							queryParams.date = options.date as string;
						}
						if (options.paymentsOnly) {	
							queryParams.paymentsOnly = options.paymentsOnly as boolean;
						}

						responseData = await xeroApiRequest.call(this, 'GET', `/Reports/TrialBalance`, { organizationId }, queryParams);
						responseData = responseData.Reports;
						
						// Transform data if formatting is requested
						if (options.formatReport) {
							responseData = transformReport(responseData);
						}
					}					
				}

				// BANK TRANSACTIONS
				if (resource === 'banktransactions') {
					// Create
					if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const type = this.getNodeParameter('type', i) as string;
						const contactId = this.getNodeParameter('contactId', i) as string;
						const bankAccountId = this.getNodeParameter('bankAccountId', i) as string;
						const lineItemsInputMethod = this.getNodeParameter('lineItemsInputMethod', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							organizationId,
							Type: type,
							Contact: { ContactID: contactId },
							BankAccount: { AccountID: bankAccountId },
							LineItems: [],
						};

						// Handle line items based on input method
						if (lineItemsInputMethod === 'ui') {
							const lineItemsValues = (this.getNodeParameter('lineItemsUi', i) as IDataObject)
								.lineItemsValues as IDataObject[];

							if (lineItemsValues && lineItemsValues.length > 0) {
								const lineItems: IDataObject[] = [];
								for (const lineItemValue of lineItemsValues) {
									const lineItem: IDataObject = {};
									
									if (lineItemValue.description) lineItem.Description = lineItemValue.description as string;
									if (lineItemValue.quantity) lineItem.Quantity = lineItemValue.quantity as number;
									if (lineItemValue.unitAmount) lineItem.UnitAmount = lineItemValue.unitAmount as string;
									if (lineItemValue.lineAmount) lineItem.LineAmount = lineItemValue.lineAmount as string;
									if (lineItemValue.accountCode) lineItem.AccountCode = lineItemValue.accountCode as string;
									if (lineItemValue.itemCode) lineItem.ItemCode = lineItemValue.itemCode as string;
									if (lineItemValue.taxType) lineItem.TaxType = lineItemValue.taxType as string;
									if (lineItemValue.taxAmount) lineItem.TaxAmount = lineItemValue.taxAmount as string;
									if (lineItemValue.lineItemId) lineItem.LineItemID = lineItemValue.lineItemId as string;

									// Handle tracking categories
									if (lineItemValue.trackingUi) {
										const trackingValues = (lineItemValue.trackingUi as IDataObject)
											.trackingValues as IDataObject[];
										if (trackingValues && trackingValues.length > 0) {
											const tracking: IDataObject[] = [];
											for (const trackingValue of trackingValues) {
												const categoryName = trackingValue.name as string;
												const optionName = trackingValue.option as string;
												
												if (categoryName && optionName) {
													tracking.push({
														Name: categoryName,
														Option: optionName,
													});
												}
											}
											lineItem.Tracking = tracking;
										}
									}

									lineItems.push(lineItem);
								}
								body.LineItems = lineItems;
							}
						} else if (lineItemsInputMethod === 'json') {
							const lineItemsJson = this.getNodeParameter('lineItemsJson', i) as string;
							try {
								const lineItems = JSON.parse(lineItemsJson);
								body.LineItems = lineItems;
							} catch (error) {
								throw new NodeOperationError(this.getNode(), `Invalid JSON in Line Items: ${error.message}`);
							}
						}

						// Add additional fields
						if (additionalFields.date) body.Date = additionalFields.date as string;
						if (additionalFields.reference) body.Reference = additionalFields.reference as string;
						if (additionalFields.isReconciled !== undefined) body.IsReconciled = additionalFields.isReconciled as boolean;
						if (additionalFields.currencyCode) body.CurrencyCode = additionalFields.currencyCode as string;
						if (additionalFields.currencyRate) body.CurrencyRate = additionalFields.currencyRate as string;
						if (additionalFields.url) body.Url = additionalFields.url as string;
						if (additionalFields.status) body.Status = additionalFields.status as string;
						if (additionalFields.lineAmountTypes) body.LineAmountTypes = additionalFields.lineAmountTypes as string;

						responseData = await xeroApiRequest.call(this, 'PUT', '/BankTransactions', body);
						responseData = responseData.BankTransactions;
					}
					// Get
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const bankTransactionId = this.getNodeParameter('bankTransactionId', i) as string;
						responseData = await xeroApiRequest.call(this, 'GET', `/BankTransactions/${bankTransactionId}`, { organizationId });
						responseData = responseData.BankTransactions;
					}
					// Get Many
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const headers: IDataObject = {};

						if (options.types) {
							qs.types = (options.types as string[]).join(',');
						}

						if (options.statuses) {
							qs.statuses = (options.statuses as string[]).join(',');
						}

						if (options.orderBy) {
							qs.order = `${options.orderBy} ${options.sortOrder ?? 'DESC'}`;
						}

						let whereClause = '';

						// Use custom where if provided, otherwise build from filters
						if (options.customWhere) {
							whereClause = options.customWhere as string;
						} else if (options.whereFilters) {
							const filters = (options.whereFilters as IDataObject).filters as IDataObject[];
							if (filters && filters.length > 0) {
								const whereParts: string[] = [];
								for (const filter of filters) {
									const field = filter.field as string;

									switch (field) {
										case 'Type':
											if (filter.typeValue) {
												whereParts.push(`Type=="${filter.typeValue}"`);
											}
											break;
										case 'Status':
											if (filter.statusValue) {
												whereParts.push(`Status=="${filter.statusValue}"`);
											}
											break;
										case 'Contact.ContactID':
											if (filter.contactIdValue) {
												whereParts.push(`Contact.ContactID==guid("${filter.contactIdValue}")`);
											}
											break;
										case 'Contact.Name':
											if (filter.contactNameValue) {
												whereParts.push(`Contact.Name=="${filter.contactNameValue}"`);
											}
											break;
										case 'BankAccount.AccountID':
											if (filter.bankAccountIdValue) {
												whereParts.push(`BankAccount.AccountID==guid("${filter.bankAccountIdValue}")`);
											}
											break;
										case 'BankAccount.Code':
											if (filter.bankAccountCodeValue) {
												whereParts.push(`BankAccount.Code=="${filter.bankAccountCodeValue}"`);
											}
											break;
										case 'Reference':
											if (filter.referenceValue) {
												whereParts.push(`Reference=="${filter.referenceValue}"`);
											}
											break;
										case 'IsReconciled':
											if (filter.isReconciledValue !== undefined) {
												whereParts.push(`IsReconciled==${filter.isReconciledValue}`);
											}
											break;
										case 'DateRange':
											const dateFrom = filter.dateFromValue as string;
											const dateTo = filter.dateToValue as string;
											const dateParts: string[] = [];
											if (dateFrom) {
												const fromDate = new Date(dateFrom);
												dateParts.push(`Date>=DateTime(${fromDate.getFullYear()}, ${String(fromDate.getMonth() + 1).padStart(2, '0')}, ${String(fromDate.getDate()).padStart(2, '0')})`);
											}
											if (dateTo) {
												const toDate = new Date(dateTo);
												dateParts.push(`Date<=DateTime(${toDate.getFullYear()}, ${String(toDate.getMonth() + 1).padStart(2, '0')}, ${String(toDate.getDate()).padStart(2, '0')})`);
											}
											if (dateParts.length > 0) {
												whereParts.push(dateParts.join(' && '));
											}
											break;
										case 'TotalRange':
											const totalMin = filter.totalMinValue as number;
											const totalMax = filter.totalMaxValue as number;
											const totalParts: string[] = [];
											if (totalMin !== undefined && totalMin !== null && !isNaN(totalMin)) {
												totalParts.push(`Total>=${totalMin}`);
											}
											if (totalMax !== undefined && totalMax !== null && !isNaN(totalMax)) {
												totalParts.push(`Total<=${totalMax}`);
											}
											if (totalParts.length > 0) {
												whereParts.push(totalParts.join(' && '));
											}
											break;
									}
								}
								whereClause = whereParts.join(' && ');
							}
						}

						if (whereClause) {
							qs.where = whereClause;
						}

						// Handle If-Modified-Since header
						if (options['If-Modified-Since']) {
							headers['If-Modified-Since'] = options['If-Modified-Since'] as string;
						}

						// Handle pagination
						if (options.page) {
							qs.page = options.page as number;
						}
						if (options.pageSize) {
							qs.pageSize = options.pageSize as number;
						}
						
							responseData = await xeroApiRequest.call(
								this,
								'GET',
								'/BankTransactions',
								{ organizationId },
								qs,
								undefined,
								headers,
							);
						responseData = responseData.BankTransactions;
					}
				}

				// BANK TRANSFERS
				if (resource === 'banktransfers') {
					// Create
					if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const fromBankAccountId = this.getNodeParameter('fromBankAccountId', i) as string;
						const toBankAccountId = this.getNodeParameter('toBankAccountId', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const bankTransfer: IDataObject = {
							FromBankAccount: { AccountID: fromBankAccountId },
							ToBankAccount: { AccountID: toBankAccountId },
							Amount: amount,
						};

						// Add optional fields
						if (additionalFields.date) {
							bankTransfer.Date = additionalFields.date as string;
						}
						if (additionalFields.reference) {
							bankTransfer.Reference = additionalFields.reference as string;
						}
						if (additionalFields.FromIsReconciled !== undefined) {
							bankTransfer.FromIsReconciled = additionalFields.FromIsReconciled as boolean;
						}
						if (additionalFields.ToIsReconciled !== undefined) {
							bankTransfer.ToIsReconciled = additionalFields.ToIsReconciled as boolean;
						}

						const body: IDataObject = {
							organizationId,
							BankTransfers: [bankTransfer],
						};

						responseData = await xeroApiRequest.call(this, 'PUT', '/BankTransfers', body);
						responseData = responseData.BankTransfers;
					}
					// Get
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const bankTransferId = this.getNodeParameter('bankTransferId', i) as string;
						responseData = await xeroApiRequest.call(this, 'GET', `/BankTransfers/${bankTransferId}`, { organizationId });
						responseData = responseData.BankTransfers;
					}
					// Get All
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const headers: IDataObject = {};

						if (options.orderBy) {
							qs.order = `${options.orderBy} ${options.sortOrder ?? 'DESC'}`;
						}

						// Where clause handling
						let whereClause = '';
						
						// Use custom where if provided, otherwise build from filters
						if (options.customWhere) {
							whereClause = options.customWhere as string;
						} else if (options.whereFilters) {
							const filters = (options.whereFilters as IDataObject).filters as IDataObject[];
							if (filters && filters.length > 0) {
								const whereParts: string[] = [];
								for (const filter of filters) {
									const field = filter.field as string;
									
									switch (field) {
										case 'Amount':
											if (filter.amountRange) {
												const amountRangeValues = (filter.amountRange as IDataObject).amountRangeValues as IDataObject;
												if (amountRangeValues) {
													const amountMin = amountRangeValues.amountMin as number;
													const amountMax = amountRangeValues.amountMax as number;
													const amountParts: string[] = [];
													if (amountMin !== undefined && amountMin !== null && !isNaN(amountMin)) {
														amountParts.push(`Amount>=${amountMin}`);
													}
													if (amountMax !== undefined && amountMax !== null && !isNaN(amountMax)) {
														amountParts.push(`Amount<=${amountMax}`);
													}
													if (amountParts.length > 0) {
														whereParts.push(amountParts.join(' && '));
													}
												}
											}
											break;
										case 'Date':
											if (filter.dateRange) {
												const dateRangeValues = (filter.dateRange as IDataObject).dateRangeValues as IDataObject;
												if (dateRangeValues) {
													const dateFrom = dateRangeValues.dateFrom as string;
													const dateTo = dateRangeValues.dateTo as string;
													const dateParts: string[] = [];
													if (dateFrom) {
														const fromDate = new Date(dateFrom);
														dateParts.push(`Date>=DateTime(${fromDate.getFullYear()}, ${String(fromDate.getMonth() + 1).padStart(2, '0')}, ${String(fromDate.getDate()).padStart(2, '0')})`);
													}
													if (dateTo) {
														const toDate = new Date(dateTo);
														dateParts.push(`Date<=DateTime(${toDate.getFullYear()}, ${String(toDate.getMonth() + 1).padStart(2, '0')}, ${String(toDate.getDate()).padStart(2, '0')})`);
													}
													if (dateParts.length > 0) {
														whereParts.push(dateParts.join(' && '));
													}
												}
											}
											break;
										case 'Reference':
											if (filter.referenceValue) {
												whereParts.push(`Reference=="${filter.referenceValue}"`);
											}
											break;
										case 'FromIsReconciled':
											if (filter.fromIsReconciledValue !== undefined) {
												whereParts.push(`FromIsReconciled==${filter.fromIsReconciledValue}`);
											}
											break;
										case 'ToIsReconciled':
											if (filter.toIsReconciledValue !== undefined) {
												whereParts.push(`ToIsReconciled==${filter.toIsReconciledValue}`);
											}
											break;
										case 'HasAttachments':
											if (filter.hasAttachmentsValue !== undefined) {
												whereParts.push(`HasAttachments==${filter.hasAttachmentsValue}`);
											}
											break;
										case 'FromBankAccount.Name':
											if (filter.fromBankAccountNameValue) {
												whereParts.push(`FromBankAccount.Name=="${filter.fromBankAccountNameValue}"`);
											}
											break;
										case 'ToBankAccount.Name':
											if (filter.toBankAccountNameValue) {
												whereParts.push(`ToBankAccount.Name=="${filter.toBankAccountNameValue}"`);
											}
											break;
									}
								}
								whereClause = whereParts.join(' && ');
							}
						}
						
						if (whereClause) {
							qs.where = whereClause;
						}

						// Handle If-Modified-Since header
						if (options['If-Modified-Since']) {
							headers['If-Modified-Since'] = options['If-Modified-Since'] as string;
						}

						responseData = await xeroApiRequest.call(
							this,
							'GET',
							'/BankTransfers',
							{ organizationId },
							qs,
							undefined,
							headers,
						);
						responseData = responseData.BankTransfers;
					}
				}

				// HISTORY AND NOTES
				if (resource === 'historyandnotes') {
					if (operation === 'addNote') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = this.getNodeParameter('endpoint', i) as string;
						const guid = this.getNodeParameter('guid', i) as string;
						const note = this.getNodeParameter('note', i) as string;

						const body: IDataObject = {
							organizationId,
							HistoryRecords: [
								{
									Details: note,
								},
							],
						};

						responseData = await xeroApiRequest.call(this, 'PUT', `/${endpoint}/${guid}/history`, body);
						responseData = responseData.HistoryRecords;
					}
					if (operation === 'getNotes') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const endpoint = this.getNodeParameter('endpoint', i) as string;
						const guid = this.getNodeParameter('guid', i) as string;

						responseData = await xeroApiRequest.call(
							this,
							'GET',
							`/${endpoint}/${guid}/history`,
							{ organizationId },
						);
						responseData = responseData.HistoryRecords;
					}
				}

				// MANUAL JOURNALS
				if (resource === 'manualjournals') {
					// Create
					if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const narration = this.getNodeParameter('narration', i) as string;
						const journalLinesInputMethod = this.getNodeParameter('journalLinesInputMethod', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						let journalLines: IDataObject[] = [];

						if (journalLinesInputMethod === 'ui') {
							const journalLinesUi = this.getNodeParameter('journalLinesUi', i) as IDataObject;
							if (journalLinesUi.journalLinesValues) {
								const journalLinesValues = journalLinesUi.journalLinesValues as IDataObject[];
								for (const line of journalLinesValues) {
									const journalLine: IDataObject = {
										AccountCode: line.accountCode,
										LineAmount: parseFloat(line.lineAmount as string),
									};

									if (line.description) {
										journalLine.Description = line.description;
									}

									if (line.taxType) {
										journalLine.TaxType = line.taxType;
									}

									if (line.trackingUi) {
										const trackingUi = line.trackingUi as IDataObject;
										if (trackingUi.trackingValues) {
											const trackingValues = trackingUi.trackingValues as IDataObject[];
											journalLine.Tracking = trackingValues.map((tracking: IDataObject) => ({
												Name: tracking.name,
												Option: tracking.option,
											}));
										}
									}

									journalLines.push(journalLine);
								}
							}
						} else {
							journalLines = this.getNodeParameter('journalLinesJson', i) as IDataObject[];
						}

						if (journalLines.length < 2) {
							throw new NodeOperationError(this.getNode(), 'Manual journal must have at least 2 journal lines');
						}

						const body: IDataObject = {
							organizationId,
							Narration: narration,
							JournalLines: journalLines,
						};

						if (additionalFields.date) {
							const date = new Date(additionalFields.date as string);
							body.Date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
						}

						if (additionalFields.lineAmountTypes) {
							body.LineAmountTypes = additionalFields.lineAmountTypes;
						}

						if (additionalFields.status) {
							body.Status = additionalFields.status;
						}

						if (additionalFields.url) {
							body.Url = additionalFields.url;
						}

						if (additionalFields.showOnCashBasisReports !== undefined) {
							body.ShowOnCashBasisReports = additionalFields.showOnCashBasisReports;
						}

						responseData = await xeroApiRequest.call(this, 'POST', '/ManualJournals', body);
						responseData = responseData.ManualJournals;
					}
					// Get
					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const manualJournalId = this.getNodeParameter('manualJournalId', i) as string;
						responseData = await xeroApiRequest.call(this, 'GET', `/ManualJournals/${manualJournalId}`, { organizationId });
						responseData = responseData.ManualJournals;
					}
					// Get All
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const headers: IDataObject = {};

						if (options.orderBy) {
							qs.order = `${options.orderBy} ${options.sortOrder ?? 'ASC'}`;
						}

						// Where clause handling
						let whereClause = '';
						
						// Use custom where if provided, otherwise build from filters
						if (options.customWhere) {
							whereClause = options.customWhere as string;
						} else if (options.whereFilters) {
							const filters = (options.whereFilters as IDataObject).filters as IDataObject[];
							if (filters && filters.length > 0) {
								const whereParts: string[] = [];
								for (const filter of filters) {
									const field = filter.field as string;
									
									switch (field) {
										case 'DateRange':
											if (filter.dateFromValue || filter.dateToValue) {
												const dateParts: string[] = [];
												if (filter.dateFromValue) {
													const fromDate = new Date(filter.dateFromValue as string);
													dateParts.push(`Date>=DateTime(${fromDate.getFullYear()}, ${String(fromDate.getMonth() + 1).padStart(2, '0')}, ${String(fromDate.getDate()).padStart(2, '0')})`);
												}
												if (filter.dateToValue) {
													const toDate = new Date(filter.dateToValue as string);
													dateParts.push(`Date<=DateTime(${toDate.getFullYear()}, ${String(toDate.getMonth() + 1).padStart(2, '0')}, ${String(toDate.getDate()).padStart(2, '0')})`);
												}
												if (dateParts.length > 0) {
													whereParts.push(dateParts.join(' && '));
												}
											}
											break;
										case 'Narration':
											if (filter.narrationValue) {
												whereParts.push(`Narration=="${filter.narrationValue}"`);
											}
											break;
										case 'Status':
											if (filter.statusValue) {
												whereParts.push(`Status=="${filter.statusValue}"`);
											}
											break;
									}
								}
								whereClause = whereParts.join(' && ');
							}
						}
						
						if (whereClause) {
							qs.where = whereClause;
						}

						// Handle If-Modified-Since header
						if (options['If-Modified-Since']) {
							headers['If-Modified-Since'] = options['If-Modified-Since'] as string;
						}

						responseData = await xeroApiRequest.call(
							this,
							'GET',
							'/ManualJournals',
							{ organizationId },
							qs,
							undefined,
							headers,
						);
						responseData = responseData.ManualJournals;
					}
				}

				// If routing already resolved the request, return what n8n put on the item
				if (items[i].json?.__response) {
					returnData.push(items[i]);
					continue;
				}
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as JsonObject).message } });
					continue;
				}
				throw error;
			}
		}
		return [returnData];
	}
}
