import { FilterConditionOperator } from "@pnp/modern-search-core/dist/es6/models/common/IDataFilter";
import { IDataFilterConfiguration } from "@pnp/modern-search-core/dist/es6/models/common/IDataFilterConfiguration";
import { IBaseWebPartProps } from "../../models/common/IBaseWebPartProps";

export interface ISearchFiltersWebPartProps extends IBaseWebPartProps {
    
    /**
     * The configured logical operator to use between filters
     */
    filterOperator: FilterConditionOperator;

    /**
     * The filters configuration
     */
    filtersConfiguration: IDataFilterConfiguration[];

    /**
     * Dynamic data connection references for connected Search Results Web Parts
     */
    searchResultsDataSourceReferences: string[];

    /**
     * Enables verticals
     */
    useVerticals: boolean;

    /**
     * Reference to the Verticals WebPart if any connected
     */
    verticalsDataSourceReference: string;

}