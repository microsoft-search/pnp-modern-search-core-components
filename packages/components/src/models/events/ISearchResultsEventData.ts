import { IDataFilterResult } from "../common/IDataFilter";
import { ISortFieldConfiguration } from "../common/ISortFieldConfiguration";
import { IQueryAlterationResponse } from "../search/IMicrosoftSearchResponse";

export interface ISearchResultsEventData {
    availableFilters?: IDataFilterResult[];
    sortFieldsConfiguration?: ISortFieldConfiguration[];
    submittedQueryText?: string;
    resultsCount?: number;
    queryAlterationResponse?: IQueryAlterationResponse;
    from?: number;
    availableFields?: string[];
}