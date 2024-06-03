import { QueryPathBehavior, PageOpenBehavior } from "@pnp/modern-search-core/dist/es6/helpers/UrlHelper";
import { IBaseWebPartProps } from "../../models/common/IBaseWebPartProps";

export interface ISearchBoxWebPartProps extends IBaseWebPartProps {

    /**
     * Flag indicating in the search query text should be sent to an other page
     */
    searchInNewPage: boolean;

    /**
     * The page URL to send the query text
     */
    pageUrl: string;

    /**
     * Whether to use an URL fragment (#) or query string parameter to pass the query text
     */
    queryPathBehavior: QueryPathBehavior;

    /**
     * The query string parameter to use to send the query text
     */
    queryStringParameter: string;

    /**
     * Flag indicating if the search box should open a new tab or use the current page
     */
    openBehavior: PageOpenBehavior;

    /**
     * Placeholder text to display in the search box
     */
    inputPlaceholder: string;
}