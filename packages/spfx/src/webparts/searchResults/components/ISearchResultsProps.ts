import { ITemplateContext } from "../../../models/common/ITemplateContext";
import { ISearchResultsEventData } from "pnp-modern-search-core/dist/es6/models/events/ISearchResultsEventData";
import { ISearchResultsComponentProps } from "./ISearchResultComponentProps";
import { ILayoutSlot } from "../../../models/common/ILayoutSlot";
import { IBaseWebComponentWrapperProps } from "../../../models/common/IBaseWebComponentWrapper";

export interface ISearchResultsProps extends ISearchResultsComponentProps, IBaseWebComponentWrapperProps {

    /**
     * Callback handler when results have been fetched
     * @param data the results data
     */
    onResultsFetched: (data: ISearchResultsEventData) => void;

    /**
     * The curent UI culture name
     */
    currentUICultureName: string;

    /**
     * The web HTML template content
     */
    templateContent: string;

    /**
     * The context to pass to web component
     */
    templateContext: ITemplateContext;

    /**
     * The current available slots from template
     */
    templateSlots: ILayoutSlot[];
}