import { IConfigurationTab } from "./IConfigurationTab";

export interface IConfigurationPanelProps<T> {

    /**
     * The panel title
     */
    renderPanelTitle?: ((propsDataObject: T) => string);

    /**
     * Property in the object used as item title
     */
    renderRowTitle: (formData: T) => string;

    /**
     * The input data object to render
     */
    dataObject?: T;

    /**
     * Tabs configuration for the panel
     */
    configurationTabs: IConfigurationTab[];

    /**
     * Callback handler when the form is saved
     * @param formData the current form data of type T
     */
    onFormSave: (formData: T) => void;

    /**
     * Callback handler when the form is dismissed without saving
     * @param formData the current form data of type T
     */
    onFormDismissed?: (formData: T) => void;
}