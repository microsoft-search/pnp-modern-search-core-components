import { IMicrosoftSearchDataSourceData } from "../../models/search/IMicrosoftSearchDataSourceData";
import { IMicrosoftSearchQuery } from "../../models/search/IMicrosoftSearchRequest";
import {
    DirectoryObject,
    Drive,
    DriveItem,
    List,
    ListItem,
    Message,
    Site
} from "@microsoft/microsoft-graph-types";

export interface IMicrosoftSearchService {
   
    useBetaEndPoint: boolean;

    /**
    * Performs a search query against Microsoft Search
    * @param searchQuery The search query in KQL forma
    * @param culture The language cutlure to query (ex: 'fr-fr'). If not set, default is 'en-US')
    * @return The search results
    */
    search(searchQuery: IMicrosoftSearchQuery, culture?: string): Promise<IMicrosoftSearchDataSourceData>;

    /**
     * Abort the current HTTP request
     */
    abortRequest();
}

/**
 * Object representing a Search Resource
 */
export type SearchResource = Partial<
  DriveItem & Site & List & Message & ListItem & Drive & DirectoryObject & Answer & UserResource
>;

export interface Answer {
    "@odata.type": string;
    displayName?: string;
    description?: string;
    webUrl?: string;
}
  
export interface UserResource {
    lastModifiedBy?: {
        user?: {
        email?: string;
        };
    };
    userPrincipalName?: string;
}
