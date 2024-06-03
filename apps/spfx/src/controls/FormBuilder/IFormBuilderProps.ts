import { IConfigurationTabField } from "../ConfigurationPanel/IConfigurationTabField";

export interface IFormBuilderProps<T> {

    /**
     * Flag indicating if errors should be validated on load and the caller notified
     */
    validateOnLoad?: boolean;

    /**
     * The default form data to render
     */
    dataObject: T;

    /**
     * Fields contained in this tab
     */
    fields: IConfigurationTabField[];
    
    /**
     * Callback handler when values are updated in the form
     * @param value the form data
     */
    onFormValuesUpdated: (value: T, errors: Map<string,string>) => void;
}