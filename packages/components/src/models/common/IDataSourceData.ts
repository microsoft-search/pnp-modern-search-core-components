import { IResultTemplates } from "../search/IResultTemplates";
import { IDataFilterResult } from "./IDataFilter";

export interface IDataSourceData {

    /**
     * Items returned by the data source.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: { [key: string]:any }[];

    /**
     * The count of items returned by the datasource
     */
    totalCount?:number;

    /**
     * The available filters provided by the data source according to the filters configuration provided from the data context (if applicable).
     */
    filters?: IDataFilterResult[];

    /**
     * Result templates available for items provided by the data source
     */
    resultTemplates?: IResultTemplates;

    /**
     * The raw response aas returned by the API
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawResponse?: any;

    /**
     * The request made
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawRequest?: any;
}
