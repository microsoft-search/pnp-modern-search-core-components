import { IBaseWebPartProps } from "../../models/common/IBaseWebPartProps";
import { IMicrosoftSearchDataSourceProperties } from "../../datasources/MicrosoftSearchDataSource";

export interface ISearchResultsWebPartProps extends IBaseWebPartProps, IMicrosoftSearchDataSourceProperties {

    /**
     * Enables verticals
     */
    useVerticals: boolean;

    /**
     * Reference to the Verticals WebPart if any connected
     */
    verticalsDataSourceReference: string;

    /**
     * The configured selected vertical keys when results should be displayed
     */
    selectedVerticalKeys: string[];

    /**
     * To show the results count or not
     */
    showResultsCount: boolean;
}
  