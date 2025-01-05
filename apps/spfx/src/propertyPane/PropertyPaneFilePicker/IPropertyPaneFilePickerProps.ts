import { BaseComponentContext } from "@microsoft/sp-component-base";
import { IFilePickerResult } from "@pnp/spfx-controls-react";

export interface IPropertyPaneFilePickerProps {
    label?: string;
    componentContext: BaseComponentContext;
    filePickerResult?: IFilePickerResult;
}