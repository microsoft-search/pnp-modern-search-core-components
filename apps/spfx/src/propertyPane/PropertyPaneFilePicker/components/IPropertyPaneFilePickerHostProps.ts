import { BaseComponentContext } from "@microsoft/sp-component-base";
import { IFilePickerResult } from "@pnp/spfx-controls-react";

export interface IPropertyPaneFilePickerHostProps {
    label?: string;
    componentContext: BaseComponentContext;
    filePickerResult?: IFilePickerResult;
    onFileSelected: (filePickerResult: IFilePickerResult) => void;
}