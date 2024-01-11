import { FilterConditionOperator } from "@pnp/modern-search-core/dist/es6/models/common/IDataFilter";
import { IDataFilterConfiguration } from "@pnp/modern-search-core/dist/es6/models/common/IDataFilterConfiguration";
import { IBaseWebComponentWrapperProps } from "../../../models/common/IBaseWebComponentWrapper";

export interface ISearchFiltersProps extends IBaseWebComponentWrapperProps {

    /**
     * Enables the debug mode on component
     */
    enableDebugMode: boolean;
    
    /**
     * The default logical operator to use between filters
     */
    operator: FilterConditionOperator; 

    /**
     * Connected search results
     */
    searchResultsComponentIds: string[];

    /**
     * Connected search verticals
     */
    searchVerticalsComponentId: string;

    /**
     * The filters configuration
     */
    filtersConfiguration: IDataFilterConfiguration[];

    /**
     * The web HTML template content
     */
    templateContent: string;
}

