import { IReadonlyTheme } from "@microsoft/sp-component-base";

export interface IPropertyPaneCodeEditorHostProps {
    label?: string
    defaultValue: string;
    onValueChange: (value: string) => void;
    isReadOnly?: boolean;
    theme?: IReadonlyTheme;
}