import { IReadonlyTheme } from "@microsoft/sp-component-base";

export interface IPropertyPaneCodeEditorProps {
    label?: string
    defaultValue: string;
    isReadOnly?: boolean;
    theme?: IReadonlyTheme
}