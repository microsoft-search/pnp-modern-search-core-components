import { ISearchSortProperty } from "../search/IMicrosoftSearchRequest";

export interface ISearchSortEventData {

    /**
     * The Microsoft Search properties
     */
    sortProperties: ISearchSortProperty[];
}