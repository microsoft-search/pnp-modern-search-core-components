import { IComboBoxOption, IComboBoxProps } from "office-ui-fabric-react";

export interface IPropertyPaneComboboxProps extends IComboBoxProps {

    /**
     * Callback when a new manual value is added
     * @param options the new options
     * @returns the new available options
     */
    onValueChange?: (options: IComboBoxOption[]) => void;
}