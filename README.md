# n8n-nodes-xero-extended

[![npm version](https://badge.fury.io/js/n8n-nodes-xero-extended.svg?icon=si%3Anpm)](https://badge.fury.io/js/n8n-nodes-xero-extended)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An enhanced Xero integration for n8n that extends the standard Xero node with additional resources and improved functionality.

Xero Extended is an enhanced Xero integration that extends the standard Xero node with additional resources and improved functionality, including enhanced search capabilities, summary modes, and quality-of-life improvements.

![Xero Extended Action Comparison](Screenshot_Xero_action_comparison.png)

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Resources](#resources)
- [Setup after installation](#setup-after-installation)
- [License](#license)
- [Support](#support)
- [Acknowledgments](#acknowledgments)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. In short:

1. In n8n, open **Settings → Community Nodes** and select **Install**.
2. Enter the npm package name `n8n-nodes-xero-extended` and confirm.
3. Once installed, set up the credentials for the node (see [Credentials](#credentials)).

**Note:** This node is currently only available for self-hosted n8n instances. Support for n8n Cloud is planned via pull requests to the base Xero node; because of the volume of changes involved, batching them into a later update is more practical than many individual pull requests for the n8n team to review.

## Operations

This node provides enhanced functionality for Xero integration, including additional resources and quality-of-life improvements that go beyond the standard Xero node.

### Available Operations

- **Contacts**: Get, Get Many, Create, Update, Delete
- **Invoices**: Get, Get Many, Create, Update, Delete
- **Organisations**: Get Connected Organisations, Get Organisation Details
- **Attachments**: Upload, Get, Get Many
- **Accounts**: Create, Get, Get Many, Update, Delete
- **Reports**: Get 1099 Report, Get Balance Sheet Report, Get Budget Summary Report, Get Profit and Loss Report, Get Trial Balance Report
- **Bank Transactions**: Create, Get, Get Many
- **Bank Transfers**: Create, Get, Get Many
- **Manual Journals**: Create, Get, Get Many
- **Journals**: Get, Get Many (system-generated general ledger entries, read-only)
- **History and Notes**: Create Note, Get History

Users can also benefit from the increased scopes to perform custom API calls with expanded actions.

## Credentials

This node uses Xero OAuth2 credentials that are separate from the standard Xero node. The credentials request additional scopes not included in the original Xero base node.

### Required Scopes

Xero migrated its broad accounting scopes to granular, per-resource scopes ([details](https://developer.xero.com/documentation/guides/oauth2/scopes/)). This node requests the granular set:

**Connection**
- `offline_access`

**Accounting — transactions**
- `accounting.invoices`
- `accounting.payments`
- `accounting.banktransactions` (also covers bank transfers)
- `accounting.manualjournals`

**Accounting — core**
- `accounting.settings` (accounts, organisation, tax rates)
- `accounting.contacts`
- `accounting.attachments`
- `accounting.budgets.read`

**Accounting — reports (read-only)**
- `accounting.reports.aged.read`
- `accounting.reports.balancesheet.read`
- `accounting.reports.banksummary.read`
- `accounting.reports.budgetsummary.read`
- `accounting.reports.executivesummary.read`
- `accounting.reports.profitandloss.read`
- `accounting.reports.trialbalance.read`
- `accounting.reports.taxreports.read`
- `accounting.reports.tenninetynine.read` (1099)

**Files**
- `files`

**Optional — general ledger (read-only)**
- `accounting.journals.read` — required by the **Journals** resource, but Xero does not assign
  this scope to newly registered apps, so it is **not requested by default** (requesting a scope
  your app lacks fails the whole connection). If your Xero app has the scope, enable
  **Include Journal Endpoint Scope** in the credential before connecting.

### Setup

1. Create a new Xero OAuth2 credential (cannot use the base Xero node credentials)
2. Select the resource/organizations you want to work with or accept all

> **Upgrading?** If your credentials were created under an earlier version of this node (broad
> scopes, or before the Journals resource was added), reconnect them after upgrading — OAuth2
> refresh tokens only carry the scopes granted at the time of consent. Also ensure your Xero
> developer app allows the requested scopes.
>
> **Using the Journals resource?** Enable **Include Journal Endpoint Scope** in the
> credential and reconnect. This is off by default because Xero does not assign
> `accounting.journals.read` to newly registered apps, and requesting an unassigned scope fails
> the connection.

## Compatibility

This node is compatible with n8n versions that support community nodes. Tested with recent n8n versions.

## Resources

### 📞 Contacts
Enhanced contact management with improved search and performance options:

- **Get Contact** - Retrieve a single contact with optional summary mode
- **Get Many Contacts** - Retrieve multiple contacts with enhanced search capabilities
- **Create Contact** - Create new contacts
- **Update Contact** - Update existing contacts
- **Delete Contact** - Remove contacts

**Improvements:**
- ✅ **Summary Only Option** - Returns lightweight responses for faster execution
- ✅ **Enhanced Search** - Case-insensitive text search across Name, FirstName, LastName, ContactNumber, CompanyNumber, and EmailAddress fields

### 🧾 Invoices
Comprehensive invoice management with enhanced functionality:

- **Get Invoice** - Retrieve a single invoice with optional summary mode
- **Get Many Invoices** - Retrieve multiple invoices with search capabilities
- **Create Invoice** - Create new invoices
- **Update Invoice** - Update existing invoices
- **Delete Invoice** - Remove invoices

**Improvements:**
- ✅ **Summary Only Option** - Returns lightweight responses for faster execution
- ✅ **Enhanced Search** - Case-insensitive text search across invoice fields
- ✅ **Contact Selection** - Dropdown to select contacts by name with fallback to ContactID via expression

### 🏢 Organisations
Manage organization information and connections:

- **Get Connected Organisations** - Retrieve list of connected organizations
- **Get Organisation Details** - Get detailed organization information

### 📎 Attachments
Complete attachment management for all transaction types:

- **Upload Attachment** - Upload files to any transaction (Invoices, Bills, Bank Transactions, etc.)
- **Get Attachments** - Retrieve list of attachments for a transaction
- **Get Attachment** - Download specific attachment files

### 💰 Accounts
Full account management capabilities:

- **Create Account** - Create new chart of accounts entries
- **Get Account** - Retrieve specific account details
- **Get Many Accounts** - Retrieve multiple accounts with filtering
- **Update Account** - Modify existing accounts
- **Delete Account** - Remove accounts

**Quality of Life Improvements:**
- ✅ **Enhanced Filtering** - Click-and-select filters for easier "Get All" result filtering

### 📊 Reports
Comprehensive reporting capabilities:

- **Get 1099 Report** - Retrieve 1099 tax reports
- **Get Balance Sheet Report** - Access balance sheet data
- **Get Budget Summary Report** - Retrieve budget information
- **Get Profit and Loss Report** - Access P&L statements
- **Get Trial Balance Report** - Retrieve trial balance data

**Quality of Life Improvements:**
- ✅ **Format Report in Simple Format** - Optional toggle (off by default) that transforms Xero's nested report structure into flat, readable line items with parsed amounts. Available on Balance Sheet, Budget Summary, Profit and Loss, and Trial Balance reports; original formatted values are preserved alongside in `*Formatted` fields.

### 🏦 Bank Transactions
Complete bank transaction management:

- **Create Bank Transaction** - Create new bank transactions
- **Get Bank Transactions** - Retrieve transaction history
- **Get Many Transactions** - Retrieve multiple transactions with filtering

### 💸 Bank Transfers
Manage bank transfers between accounts:

- **Create Bank Transfer** - Create transfers between bank accounts
- **Get Bank Transfers** - Retrieve transfer history
- **Get Many Transactions** - Retrieve multiple transfers with filtering

### Manual Journals
Manage manual journal entries:

- **Create Manual Journal** - Create new manual journal entries
- **Get Manual Journal** - Retrieve specific manual journal details
- **Get Many Manual Journals** - Retrieve multiple manual journals with filtering

### 📒 Journals
Read-only access to Xero's general ledger — the system-generated journal entries created automatically from invoices, bills, payments, manual journals, and other transactions:

- **Get Journal** - Retrieve a single journal by JournalID (GUID) or JournalNumber (integer)
- **Get Many Journals** - Retrieve journals with automatic offset-based pagination

> **Requires** the optional `accounting.journals.read` scope — enable **Include Journal
> Endpoint Scope** in the credential (see [Credentials](#credentials)). Your Xero app must have
> been assigned this scope; Xero does not grant it to newly registered apps.

**Options:**
- ✅ **Return All** - Automatically pages through the full ledger (Xero returns 100 journals per request)
- ✅ **Offset** - Resume retrieval after a specific journal number
- ✅ **Payments Only** - Cash-basis journals only (accrual basis by default)
- ✅ **If-Modified-Since** - Only journals created or modified since a given timestamp

### 📝 History and Notes
Track changes and manage notes:

- **Create Note** - Add new notes
- **Get History** - Retrieve transaction history

## Setup after installation

Similar to base Xero node:
1. Once installed you will set up the credentials in the same way done for the Xero base node. (you can't use the base Xero node as additional scopes are requested and needed for this node)
2. Select the resource/organisations you want to work with or accept all

## License

[MIT](LICENSE)

## Support

For support, please open an issue on the [GitHub repository](https://github.com/Mad-Man-Dan/n8n-nodes-xero-extended).

## Acknowledgments

This node is built upon the official n8n Xero node. Special thanks to:

- **n8n team** - For the original Xero node implementation
- **Xero API team** - For providing the excellent API
- **n8n community** - For the supportive ecosystem

### Original Work Attribution

This project extends the functionality of the official n8n Xero node, which is part of the n8n core project. The original Xero node is licensed under the MIT License and is maintained by the n8n team.

- Original Xero node: [n8n-nodes-base.xero](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.xero/)
- n8n project: [https://n8n.io](https://n8n.io)

For detailed attribution information, see [ACKNOWLEDGMENTS.md](ACKNOWLEDGMENTS.md).

## Author

**Daniel Fonseca** - [daniel@appvisory.dev](mailto:daniel@appvisory.dev)

---

Built for the n8n community and shout out to AutomationTown
