import { ISortFieldConfiguration } from "@pnp/modern-search-core/dist/es6/models/common/ISortFieldConfiguration";
import { EntityType } from "@pnp/modern-search-core/dist/es6/models/search/IMicrosoftSearchRequest";

export interface ISearchResultsComponentProps {
    defaultQueryText: string;
    queryTemplate: string;
    selectedFields: string[];
    showPaging: boolean;
    pageSize: number;
    numberOfPagesToDisplay: number;
    enableResultTypes: boolean;
    connectionIds: string[];
    enableModification: boolean;
    enableSuggestion: boolean;
    entityTypes: EntityType[];
    searchInputComponentId: string;
    searchFiltersComponentId: string;
    searchVerticalsComponentId: string;
    selectedVerticalKeys: string[];
    useBetaEndpoint: boolean;
    showCount: boolean;
    sortFieldsConfiguration: ISortFieldConfiguration[];
}