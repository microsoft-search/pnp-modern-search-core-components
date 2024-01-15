import { Providers } from "@microsoft/mgt-element/dist/es6/providers/Providers";
import { ThemeInternalCSSVariables } from "../common/Constants";
import { BATCH_SIZE_LIMIT, HttpMethod, IGraphBatchBody, IGraphBatchRequest } from "../models/common/IGraphBatch";
import { Client, ClientOptions, FetchOptions } from "@microsoft/microsoft-graph-client";
import { merge, uniqBy } from "lodash-es";
import { IDataSourceData } from "src/models/common/IDataSourceData";
import { ObjectHelper } from "./ObjectHelper";

/**
 * Fields to be added dynamically to search results
 */
export enum SearchResponseEnhancedFields {
    FileTypeFamily = "filefamily",
    ThumbnailUrl = "thumbnailUrl",
    PreviewUrl = "previewUrl",
    IsCustomApp = "iscustomapp"
}

/**
 * Well known SharePoint managed properties (lower cased)
 */
export enum WellKnownSearchProperties {
    FileType = "filetype",
    MSSearchFileType = "mssearchfiletype",
    Title = "title",
    Summary = "summary",
    NormListID = "normlistid",
    NormUniqueID = "normuniqueid",
    NormSiteID = "normsiteid"
}

export const sanitizeSummary = (summary: string) => {
    // Special case with HitHighlightedSummary field
    // eslint-disable-next-line no-useless-escape
    return summary?.replace(/<c0\>/g, `<span style='color:var(${ThemeInternalCSSVariables.colorPrimary});font-weight:600'>`).replace(/<\/c0\>/g, "</span>").replace(/<ddd\/>/g, "&#8230;");
};

export class SearchResultsHelper {

    private controller: AbortController;

    public static readonly FileTypeAssociations = {
        "word": ["doc","docx","docm","dot","dotx","dotm"],
        "excel": ["xls","xlsx","csv","xlsm","xlsb","xlx","xml","csv","xltm","xlt","xltx"],
        "powerpoint": ["ppt","pptx","pptm","pps","ppsm","ppsx","potx","potm","pot"],
        "onenote": ["one"],
        "text": ["txt","rtf"],
        "visio": ["vsd","vsdx","vsdm"],
        "webpage": ["aspx","html"],
        "pdf": ["pdf","application/pdf"],
        "archive": ["zip","7z","rar"],
        "video": ["mp4","avi","mov","flv","wmv","webm","ogg"]
    };
    
    /**
     * Get the file famnily for its extension
     * @param fileExtension the file extension
     * @returns the file family corresponding to this extensions
     */
    private getFileIconType(fileExtension: string): string {

        let fileType =  "generic";
        if (fileExtension) {
            fileType =  Object.keys(SearchResultsHelper.FileTypeAssociations).filter(key => { 
                return SearchResultsHelper.FileTypeAssociations[key].indexOf(fileExtension?.toLowerCase()) !== -1; 
            })[0];
        }

        return fileType;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async enhanceResults(items: { [key: string]:any }[], selectedFields: string[], isWildcard?: boolean): Promise<any[]> {

        let updatedItems = items.map((item) => {

            // Title
            if (item[WellKnownSearchProperties.Title])
                item[WellKnownSearchProperties.Title] = item[WellKnownSearchProperties.Title].replace(/\r|\t|\n/g,"");

            // File family
            if (item[WellKnownSearchProperties.FileType] || item[WellKnownSearchProperties.MSSearchFileType])
                item[SearchResponseEnhancedFields.FileTypeFamily] = this.getFileIconType(item[WellKnownSearchProperties.FileType] ? item[WellKnownSearchProperties.FileType] : item[WellKnownSearchProperties.MSSearchFileType]);
        
            // Summary
            if (item[WellKnownSearchProperties.Summary] && !isWildcard) 
                item[WellKnownSearchProperties.Summary] = sanitizeSummary(item[WellKnownSearchProperties.Summary]);

            // Host application
            if (!item[SearchResponseEnhancedFields.IsCustomApp] && this.isCustomApp()) {
                // Add a specific property to be used in Adaptive Cards to decide wether or not display non OOTB supported content (ex: HTML in Markdown)
                item[SearchResponseEnhancedFields.IsCustomApp] = "true";
            }

            return item;
        });

        // Get thumbnails from Graph if special "ThumbnailUrl" field is requested in the query 'fields'
        if (selectedFields.indexOf(SearchResponseEnhancedFields.ThumbnailUrl) !== -1) {
            const thumbnailUrls = await this.getThumbnailUrls(items);

            updatedItems = updatedItems.map(item => {
                item[SearchResponseEnhancedFields.ThumbnailUrl] = thumbnailUrls.get(item.normuniqueid);
                return item;
            });
        }

        // Get previews from Graph if special "PreviewUrl" field is requested in the query 'fields'
        if (selectedFields.indexOf(SearchResponseEnhancedFields.PreviewUrl) !== -1) {
            const previewUrls = await this.getPreviewUrls(items);

            updatedItems = updatedItems.map(item => {
                item[SearchResponseEnhancedFields.PreviewUrl] = previewUrls.get(item.normuniqueid);
                return item;
            });           
        }

        return updatedItems;
    }

    public abortRequest() {
        if (this.controller)
            this.controller.abort();
    }
    
    private async getThumbnailUrls(items: {[key: string]: string}[]): Promise<Map<string,string>> {

       return await this.getItemsByBatch(items, 
        (item) => item[WellKnownSearchProperties.NormUniqueID] && item[WellKnownSearchProperties.NormListID] && item[WellKnownSearchProperties.NormSiteID],
        (item) => {
            return {
                "id": item.normuniqueid,
                "method": HttpMethod.Get,
                "url": `/sites/${item.normsiteid}/lists/${item.normlistid}/items/${item.normuniqueid}/driveItem/thumbnails/0/large/url`
            } as IGraphBatchRequest;
        },
        (batchResponse) => { return batchResponse.body.value; }
       );
    }

    private async getPreviewUrls(items: {[key: string]: string}[]): Promise<Map<string,string>> {

        return await this.getItemsByBatch(items, 
            (item) => item[WellKnownSearchProperties.NormUniqueID] && item[WellKnownSearchProperties.NormListID] && item[WellKnownSearchProperties.NormSiteID],
            (item) => {
                return {
                    "id": item[WellKnownSearchProperties.NormUniqueID],
                    "method": HttpMethod.Post,
                    "url": `/sites/${item[WellKnownSearchProperties.NormSiteID]}/lists/${item[WellKnownSearchProperties.NormListID]}/items/${item[WellKnownSearchProperties.NormUniqueID]}/driveItem/preview`,
                    body: {},
                    headers: {
                        "Content-Type": "application/json"
                    }
                    
				} as IGraphBatchRequest;
            },
            (batchResponse) => { return batchResponse.body.getUrl; }
           );
    }

    /**
     * Build and send a Microsoft Graph batch request from items data
     * @param items items data to build the batch requests
     * @param batchRequestConditionCallback the condition for a batch request to be perfomed (ex. required fields on a item)
     * @param batchRequestBodyCallabck the batch request body to pass according to item
     * @param batchResponseValueCallback the property to use as returned value from the batch HTTP call response. This callback is only called when the HTTP response succeedeed (i.e. HTTP 200).
     * @returns an hashtable mapping batch id (the one you set as batch request id) and the value returned by the 'propertyValueCallback' callback
     */
    private async getItemsByBatch(
            items: {[key: string]: string}[],
            batchRequestConditionCallback: (item) => boolean,
            batchRequestBodyCallabck: (item) => IGraphBatchRequest, 
            batchResponseValueCallback: (batchResponse) => string
    ) {

         // To be able to cancel requests individually, a new controller needs to be instanciated every time
         this.controller = new AbortController();

         const fetchOptions: FetchOptions = {
             signal: this.controller.signal
         };
 
         const clientOptions: ClientOptions = {
             authProvider: Providers.globalProvider,
             fetchOptions: fetchOptions
         };
 
         const client = Client.initWithMiddleware(clientOptions);
 
         const propertiesMap = new Map<string,string>();
         const batchRequestsChunks: IGraphBatchRequest[][] = [];
         const batchRequestBodyChunks: IGraphBatchBody[] = [];
 
         items.forEach((item, index) => {
             if (batchRequestConditionCallback(item)) {
 
                 // Determine the correct chunk index according to the allowed batch size
                 const chunkIdx = Math.floor(index / BATCH_SIZE_LIMIT);
 
                 if (!batchRequestsChunks[chunkIdx]) {
                     batchRequestsChunks[chunkIdx] = []; // Initialize new chunk
                 }
 
                 batchRequestsChunks[chunkIdx].push(batchRequestBodyCallabck(item));
             }
         });
 
         // Build body chunks
         batchRequestsChunks.forEach(batchRequestChunk => {
             batchRequestBodyChunks.push({
                 requests: uniqBy(batchRequestChunk, "id")
             });
         });
 
         const batchChunkPromises = batchRequestBodyChunks.map(bodyChunk => {
 
             const url = "https://graph.microsoft.com/v1.0/$batch";
             return client.api(url).headers({ 
                "SdkVersion": "PnPModernSearchCoreComponents"
             }).post(bodyChunk);				
         });
 
         // Execute all batch chunks
         const batchChunkResponses = await Promise.all(batchChunkPromises);
 
         // Parse all responses
         batchChunkResponses.forEach(jsonBatchResponses => {
 
             jsonBatchResponses.responses.forEach(batchResponse => {
                if (batchResponse.status === 200) {
                    propertiesMap.set(batchResponse.id, batchResponseValueCallback(batchResponse));
                }
             });
         });
 
         return propertiesMap;
    }
    
    private isCustomApp(): boolean {

        if (/(\.office\.com)|(sharepoint\.com)|(bing\.com)/.test(window.location.origin)) {
            return false;
        }

        return true;
    }

     /**
     * Retrieves the available fields from results
     * @param data the current data
     */
    public getAvailableFieldsFromResults(data: IDataSourceData): string[] {

        if (data.items.length > 0) {

            let mergedItem: any = {};

            // Consolidate all available properties from all items 
            data.items.forEach(item => {
                mergedItem = merge(mergedItem, item);
            });

            // Flatten properties (ex: a.b.c)
            mergedItem = ObjectHelper.flatten(mergedItem);

            return Object.keys(mergedItem).map(key => {
                return key;
            });

        } else {
            return [];
        }
    }
}