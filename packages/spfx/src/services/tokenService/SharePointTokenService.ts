/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @rushstack/security/no-unsafe-regexp */
/* eslint-disable require-atomic-updates */
import { ServiceKey, ServiceScope, Log } from "@microsoft/sp-core-library";
import { PageContext } from '@microsoft/sp-page-context';
import { SPHttpClient } from '@microsoft/sp-http';
import { DateHelper } from '@pnp/modern-search-core/dist/es6/helpers/DateHelper';
import { Constants } from "../../common/Constants";
import { ObjectHelper } from '@pnp/modern-search-core/dist/es6/helpers/ObjectHelper';
import { isEmpty, uniq } from "@microsoft/sp-lodash-subset";
import { IProfileProperties, ISharePointTokenService } from "./ISharePointTokenService";

const TokenService_ServiceKey = 'ModernSearchCoreSharePointTokenService';

export class SharePointTokenService implements ISharePointTokenService {

    /**
     * The list of user properties. Used to avoid refetching it every time.
     */
    private userProperties: IProfileProperties = null;

    /**
     * The current page item. Used to avoid refetching it every time.
     */
    private currentPageItem: { [key:string] : unknown } = null;

    /**
     * The current service scope
     */
    private serviceScope: ServiceScope;

    /**
     * The current page context
     */
    private pageContext: PageContext;

    /**
     * The SPHttpClient instance
     */
    private spHttpClient: SPHttpClient;

    /**
     * A date helper instance
     */
    private dateHelper: DateHelper;

    /**
     * The moment.js library reference
     */
    private dayJs: any;

    public static ServiceKey: ServiceKey<ISharePointTokenService> = ServiceKey.create(TokenService_ServiceKey, SharePointTokenService);

    public constructor(serviceScope: ServiceScope) {

        this.serviceScope = serviceScope;

        serviceScope.whenFinished(() => {

            this.pageContext = serviceScope.consume<PageContext>(PageContext.serviceKey);
            this.spHttpClient = serviceScope.consume<SPHttpClient>(SPHttpClient.serviceKey);

            this.dateHelper = new DateHelper();
        });
    }

    public async resolveTokens(inputString: string): Promise<string> {

        if (inputString) {

            this.dayJs = await this.dateHelper.dayJs(this.pageContext.cultureInfo.currentUICultureName);

            // Resolves dynamic tokens (i.e. tokens resolved asynchronously versus static ones set by the Web Part context)
            inputString = await this.replacePageTokens(inputString);
            inputString = await this.replaceUserTokens(inputString);
            inputString = this.replaceDateTokens(inputString);
            inputString = this.replaceQueryStringTokens(inputString);
            inputString = this.replaceWebTokens(inputString);
            inputString = this.replacePageContextTokens(inputString);
            inputString = this.replaceSiteTokens(inputString);
            inputString = this.replaceListTokens(inputString);
            inputString = this.replaceGroupTokens(inputString);
            inputString = this.replaceLegacyPageContextTokens(inputString);
            inputString = await this.replaceHubTokens(inputString);
            inputString = inputString.replace(/\{TenantUrl\}/gi, `https://` + window.location.host);

            // The 'OR/AND' operator should be called after all tokens are processed (works with comma delimited values potentially coming from resolved)
            inputString = this.replaceAndOrOperator(inputString);
        }

        return inputString;
    }

    /**
     * Retrieves available current page item properties
     */
    public async getPageProperties(): Promise<{}> {

        let item = null;

        // Do this check to ensure we are not in the workbench
        if (this.pageContext.listItem) {

            const url = this.pageContext.web.absoluteUrl + `/_api/web/GetList(@v1)/RenderExtendedListFormData(itemId=${this.pageContext.listItem.id},formId='viewform',mode='2',options=7)?@v1='${this.pageContext.list.serverRelativeUrl}'`;

            try {
                const response = await this.spHttpClient.post(url, SPHttpClient.configurations.v1, {
                    headers: {
                        'X-ClientService-ClientTag': Constants.X_CLIENTSERVICE_CLIENTTAG,
                        'UserAgent': Constants.X_CLIENTSERVICE_CLIENTTAG
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    const itemRow = JSON.parse(result.value);
                    // Lower case all properties
                    // https://codereview.stackexchange.com/questions/162416/object-keys-to-lowercase
                    // eslint-disable-next-line no-sequences
                    item = Object.keys(itemRow.Data.Row[0])
                            .reduce((c: {[key: string]: any}, k: string) => {
                                c[k] = itemRow.Data.Row[0][k];
                                return c;
                            },{});
                }
                else {
                    throw response.statusText;
                }

            } catch (error) {
                const errorMessage = error ? error.message : `Failed to resolve page tokens`;
                Log.error(TokenService_ServiceKey, new Error(`Error: '${error}'`), this.serviceScope);
                throw new Error(errorMessage);
            }
        }

        return item;
    }

    /**
     * Retrieve all current user profile properties
     */
    public async getUserProfileProperties(): Promise<IProfileProperties> {

        let responseJson = null;
        const userProperties: IProfileProperties = {};
        const endpoint = `${this.pageContext.web.absoluteUrl}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`;
        const response = await this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1, {
            headers: {
                'X-ClientService-ClientTag': Constants.X_CLIENTSERVICE_CLIENTTAG,
                'UserAgent': Constants.X_CLIENTSERVICE_CLIENTTAG
            }
        });

        if (response.ok) {
            responseJson = await response.json();

            if (responseJson.UserProfileProperties) {

                responseJson.UserProfileProperties.forEach((property: any) => {
                    userProperties[property.Key.toLowerCase()] = property.Value;
                });
            }

            return userProperties;

        } else {

            const errorMessage = `${TokenService_ServiceKey}: Error retrieving user profiel properties. Details: ${(response as any).statusMessage ? (response as any).statusMessage : response.status}`;
            const error = new Error(errorMessage);

            Log.error(TokenService_ServiceKey, error, this.serviceScope);
            throw error;
        }
    }

    /**
     * Resolve current page values from tokens
     * @param inputString the input string containing tokens
     */
    private async replacePageTokens(inputString: string): Promise<string> {

        const pageTokenRegExp: RegExp = /\{(?:Page)\.(.*?)\}/gi;
        let matches = pageTokenRegExp.exec(inputString);
        let item: { [key: string] : any } = {};

        // Make a check to the listItem property in the case we are in the hosted workbench
        if (matches !== null && this.pageContext.listItem) {

            let pageItem = this.currentPageItem;

            if (!pageItem) {
                // Get page properties dymamically
                pageItem = await this.getPageProperties();
            }

            const properties = Object.keys(pageItem);
            properties.forEach(property => {
                item[property] = pageItem[property];
            });

            item = this.recursivelyLowercaseJSONKeys(item);

            // eslint-disable-next-line no-unmodified-loop-condition
            while (matches !== null && item !== null) {

                const pageProperty = matches[1];
                let itemProp: string = ''; // Return an empty string when not found instead of undefined since this value will be translated as text

                if (/\.Label|\.TermID/gi.test(pageProperty)) {

                    const term = pageProperty.split(".");
                    const columnName = term[0].toLowerCase();
                    const labelOrTermId = term[1].toLowerCase();

                    // Handle multi or single taxonomy values
                    if (Array.isArray(item[columnName]) && item[columnName].length > 0) {

                        // By convention, multi values should be separated by a comma, which is the default array delimiter for the array toString() method
                        // This value could be processed in the replaceAndOrOperator() method so we need to keep the same delimiter convention
                        itemProp = item[columnName].map((taxonomyValue: any) => {
                            return taxonomyValue[labelOrTermId]; // Use the 'TermId' or 'Label' properties
                        }).join(',');
                    }
                    else if (!Array.isArray(item[columnName]) && item[columnName] !== undefined && item[columnName] !== "") {
                        itemProp = item[columnName][labelOrTermId];
                    }

                } else {

                    // Return the property as is
                    itemProp = ObjectHelper.getPropertyByPath(item, pageProperty.toLowerCase());
                }

                inputString = inputString.replace(matches[0], itemProp);
                matches = pageTokenRegExp.exec(inputString);
            }
        }

        return inputString;
    }

    /**
     * Resolve current page context related tokens
     * @param inputString the input string containing tokens
     */
    private replacePageContextTokens(inputString: string): string {

        const siteRegExp = /\{(?:PageContext)\.(.*?)\}/gi;
        let matches = siteRegExp.exec(inputString);

        if (matches !== null) {

            while (matches !== null) {
                const prop = matches[1];
                inputString = inputString.replace(new RegExp(matches[0], "gi"), this.pageContext ? ObjectHelper.getPropertyByPath(this.pageContext, prop) : '');
                matches = siteRegExp.exec(inputString);
            }
        }

        return inputString;
    }

    /**
     * Resolve current user property values from tokens
     * @param inputString the input string containing tokens
     */
    private async replaceUserTokens(inputString: string): Promise<string> {

        const userTokenRegExp: RegExp = /\{(?:User)\.(.*?)\}/gi;
        let matches = userTokenRegExp.exec(inputString.toLowerCase());

        // Browse matched tokens
        while (matches !== null) {

            const userProperty = matches[1].toLowerCase();
            let propertyValue = null;

            // Check if other user profile properties have to be retrieved
            if (!/^(name|email)$/gi.test(userProperty)) {

                // Check if the user profile api was already called
                if (!this.userProperties) {
                    this.userProperties = await this.getUserProfileProperties();
                }

                // Need to enclose with quotes because of dash separated values (ex: "sps-interests")
                propertyValue = ObjectHelper.getPropertyByPath(this.userProperties, `"${userProperty}"`);

            } else {

                switch (userProperty) {

                    case "email":
                        propertyValue = this.pageContext.user.email;
                        break;

                    case "name":
                        propertyValue = this.pageContext.user.displayName;
                        break;
                    default:
                        propertyValue = this.pageContext.user.displayName;
                        break;
                }
            }

            // If value not found in the fetched properties, let the value untouched to be resolved server side by a query variable
            // Ex: {User.Audiences} or {User.PreferredDisplayLanguage}
            if (propertyValue !== undefined) {

                const tokenExprToReplace = new RegExp(matches[0], 'gi');

                // Replace the match with the property value
                inputString = inputString.replace(tokenExprToReplace, propertyValue);
            }

            // Look for other tokens
            matches = userTokenRegExp.exec(inputString);
        }

        inputString = inputString.replace(/\{Me\}/gi, this.pageContext.user.displayName);

        return inputString;
    }

    /**
     * Resolve date related tokens
     * @param inputString the input string containing tokens
     */
    private replaceDateTokens(inputString: string): string {

        const currentDate = /\{CurrentDate\}/gi;
        const currentMonth = /\{CurrentMonth\}/gi;
        const currentYear = /\{CurrentYear\}/gi;

        // Replaces any "{Today} +/- [digit]" expression
        const results = /\{Today\s*[+-]\s*\[{0,1}\d{1,}\]{0,1}\}/gi;
        let match: any;
        while ((match = results.exec(inputString)) !== null) {
            for (const result of match) {
                const operator = result.indexOf('+') !== -1 ? '+' : '-';
                const addOrRemove = operator === '+' ? 1 : -1;
                const operatorSplit = result.split(operator);
                const digit = parseInt(operatorSplit[operatorSplit.length - 1].replace("{", "").replace("}", "").trim()) * addOrRemove;
                const dt = new Date();
                dt.setDate(dt.getDate() + digit);
                const formatDate = this.dayJs(dt).utc().format("YYYY-MM-DDTHH:mm:ss\\Z");
                inputString = inputString.replace(result, formatDate);
            }
        }

        // Replaces any "{Today}" expression by it's actual value
        const formattedDate = this.dayJs(new Date()).utc().format("YYYY-MM-DDTHH:mm:ss\\Z");
        inputString = inputString.replace(new RegExp("{Today}", 'gi'), formattedDate);

        const d = new Date();
        inputString = inputString.replace(currentDate, d.getDate().toString());
        inputString = inputString.replace(currentMonth, (d.getMonth() + 1).toString());
        inputString = inputString.replace(currentYear, d.getFullYear().toString());

        return inputString;
    }

    /**
     * Resolve query string related tokens
     * @param inputString the input string containing tokens
     */
    private replaceQueryStringTokens(inputString: string): string {

        const webRegExp = /\{(?:\?){0,1}(?:QueryString)\.(.*?)\}/gi;
        let modifiedString = inputString;
        let matches = webRegExp.exec(inputString);

        if (matches !== null) {
            const url = new URL(window.location.href);
            const queryParameters = new URLSearchParams(url.search);

            while (matches !== null) {
                const qsProp = matches[1];
                const itemProp = decodeURIComponent(queryParameters.get(qsProp) || "");
                if (itemProp) {
                    modifiedString = modifiedString.replace(matches[0], itemProp);
                }
                else if (matches[0].indexOf("?") !== -1) {
                    // If QueryString Token is specified like this, {?QueryString.Parameter}, it is removed if the QueryString doesn't exist
                    modifiedString = modifiedString.replace(matches[0], "");
                }

                matches = webRegExp.exec(inputString);
            }
        }
        return modifiedString;
    }

    /**
     * Resolve current web related tokens
     * @param inputString the input string containing tokens
     */
    private replaceWebTokens(inputString: string): string {

        const queryStringVariables = /\{(?:Web)\.(.*?)\}/gi;
        let matches = queryStringVariables.exec(inputString);

        if (matches !== null) {

            while (matches !== null) {
                const webProp = matches[1];
                inputString = inputString.replace(new RegExp(matches[0], "gi"), this.pageContext.web ? (this.pageContext.web as {[key:string]: any})[webProp] : '');
                matches = queryStringVariables.exec(inputString);
            }
        }

        return inputString;
    }

    /**
     * Resolve current site related tokens
     * @param inputString the input string containing tokens
     */
    private replaceSiteTokens(inputString: string): string {

        const siteRegExp = /\{(?:Site)\.(.*?)\}/gi;
        let matches = siteRegExp.exec(inputString);

        if (matches !== null) {

            while (matches !== null) {
                const siteProp = matches[1];

                // Ensure the property is in the page context first. 
                // If not, let the value untouched as it could be a query variable instead processed server side (ex: {Site.URL}
                const sitePropertyValue = ObjectHelper.getPropertyByPath(this.pageContext.site, siteProp);

                if (sitePropertyValue) {
                    inputString = inputString.replace(new RegExp(matches[0], "gi"), this.pageContext.site ? sitePropertyValue : '');
                }

                matches = siteRegExp.exec(inputString);
            }
        }

        return inputString;
    }

    /**
     * Resolve current hub site related tokens
     * @param inputString the input string containing tokens
     */
    private async replaceHubTokens(inputString: string): Promise<string> {

        const hubRegExp = /\{(?:Hub)\.(.*?)\}/gi;
        let matches = hubRegExp.exec(inputString);

        // Get hub info
        const hubInfos = await this.getHubInfo();

        if (matches !== null && hubInfos) {

            while (matches !== null) {
                const hubProp = matches[1];
                inputString = inputString.replace(new RegExp(matches[0], "gi"), hubInfos[hubProp]);
                matches = hubRegExp.exec(inputString);
            }
        }

        return inputString;
    }

    /**
     * Resolve current Office 365 group related tokens
     * @param inputString the input string containing tokens
     */
    private replaceGroupTokens(inputString: string): string {

        const groupRegExp = /\{(?:Group)\.(.*?)\}/gi;
        let matches = groupRegExp.exec(inputString);

        if (matches !== null) {

            while (matches !== null) {
                const groupProp = matches[1];
                inputString = inputString.replace(new RegExp(matches[0], "gi"), this.pageContext.site.group ? ObjectHelper.getPropertyByPath(this.pageContext.site.group, groupProp) : '');
                matches = groupRegExp.exec(inputString);
            }
        }

        return inputString;
    }

    /**
     * Resolve current list related tokens
     * @param inputString the input string containing tokens
     */
    private replaceListTokens(inputString: string): string {
        const listRegExp = /\{(?:List)\.(.*?)\}/gi;
        let matches = listRegExp.exec(inputString);

        if (matches !== null) {

            while (matches !== null) {
                const listProp = matches[1];
                inputString = inputString.replace(new RegExp(matches[0], "gi"), this.pageContext.list ? ObjectHelper.getPropertyByPath(this.pageContext.list, listProp) : '');
                matches = listRegExp.exec(inputString);
            }
        }

        return inputString;
    }

    /**
     * Resolve legacy page tokens
     * @param inputString the input string containing tokens
     */
    private replaceLegacyPageContextTokens(inputString: string): string {

        const legacyPageContextRegExp = /\{(?:LegacyPageContext)\.(.*?)\}/gi;
        let matches = legacyPageContextRegExp.exec(inputString);

        if (matches !== null) {

            while (matches !== null) {
                const legacyProp = matches[1];
                inputString = inputString.replace(new RegExp(matches[0], "gi"), this.pageContext.legacyPageContext ? ObjectHelper.getPropertyByPath(this.pageContext.legacyPageContext, legacyProp) : '');
                matches = legacyPageContextRegExp.exec(inputString);
            }
        }

        return inputString;
    }

    private replaceAndOrOperator(inputString: string): string {

        // Example match: {|owstaxidmetadataalltagsinfo:{Page.<TaxnomyProperty>.TermID}}
        const orAndConditionTokens = /\{(?:(\||&)(.+?)(>=|=|<=|:|<>|<|>))(\{?.*?\}?\s*)\}/gi;
        const reQueryTemplate = inputString;
        let match = orAndConditionTokens.exec(inputString);

        if (match !== null) {
            while (match !== null) {

                const conditions = [];
                const conditionOperator = match[1];
                const property = match[2];
                const operator = match[3];
                const tokenValue = match[4];

                const quotes = '"';
                const orAndOperator = conditionOperator === '|' ? 'OR' : 'AND';

                // {User} tokens are resolved server-side by SharePoint so we exclude them
                if (!/\{(?:User)\.(.*?)\}/gi.test(tokenValue)) {
                    const allValues = tokenValue.split(/[,|]/gi); // Works with taxonomy multi values (TermID, Label) + multi choices fields + {filters.<value>.valueAsText} token. By convention, all multi values for this operator should be sparated by a comma

                    if (allValues.length > 0) {
                        // Remove duplicates before processing
                        uniq(allValues).forEach(value => {

                            if (!isEmpty(value)) {
                                // If the token value contains a whitespace, we enclose the value with quotes
                                conditions.push(`(${property}${operator}${/\s/g.test(value) ? `${quotes}${value}${quotes}` : value})`);
                            }
                        });
                    } else {

                        if (!isEmpty(tokenValue)) {
                            conditions.push(`(${property}${operator}${/\s/g.test(tokenValue) ? `${quotes}${tokenValue}${quotes}` : tokenValue})`);
                        }
                    }

                    const condition = `${conditions.join(` ${orAndOperator} `)}`;

                    inputString = inputString.replace(match[0], condition);
                }

                match = orAndConditionTokens.exec(reQueryTemplate);
            }
        }

        return inputString;
    }

    /**
     * Get hub site data
     */
    public async getHubInfo(): Promise<{[key:string]: any}> {

        try {

            const restUrl = `${this.pageContext.site.absoluteUrl}/_api/site?$select=IsHubSite,HubSiteId,Id`;
            const data = await this.spHttpClient.get(restUrl, SPHttpClient.configurations.v1, {
                headers: {
                    'X-ClientService-ClientTag': Constants.X_CLIENTSERVICE_CLIENTTAG,
                    'UserAgent': Constants.X_CLIENTSERVICE_CLIENTTAG
                }
            });

            if (data && data.ok) {
                const jsonData = await data.json();
                if (jsonData) {
                    return jsonData;
                }
            }

            return null;
        } catch (error) {

            Log.error(TokenService_ServiceKey, new Error(`Error while fetching Hub site data. Details: ${error}`), this.serviceScope);
            return null;
        }
    }

    /**
     * Recursively lower case object keys
     * https://github.com/Vin65/recursive-lowercase-json/blob/master/src/index.js
     * @param obj the JSON object
     */
    private recursivelyLowercaseJSONKeys(obj: {[key:string]: any}): {} {

        const copyOfObj = obj;
        if (typeof copyOfObj !== 'object' || copyOfObj === null) {
            return copyOfObj;
        }

        if (Array.isArray(copyOfObj)) {
            return copyOfObj.map(o => this.recursivelyLowercaseJSONKeys(o));
        }

        return Object.keys(copyOfObj).reduce((prev: {[key:string]: any}, curr: string) => {
            prev[curr.toLowerCase()] = this.recursivelyLowercaseJSONKeys(copyOfObj[curr]);
            return prev;
        }, {});
    }
}
