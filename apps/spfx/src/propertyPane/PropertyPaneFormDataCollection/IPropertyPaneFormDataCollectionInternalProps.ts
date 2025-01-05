import { IPropertyPaneCustomFieldProps } from "@microsoft/sp-property-pane";
import { IPropertyPaneFormDataCollectionProps } from "./IPropertyPaneFormDataCollectionProps";

export interface IPropertyPaneFormDataCollectionInternalProps<T> extends IPropertyPaneFormDataCollectionProps<T>, IPropertyPaneCustomFieldProps {
}