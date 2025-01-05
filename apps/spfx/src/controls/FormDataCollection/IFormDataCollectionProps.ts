import { IConfigurationTabField } from "../ConfigurationPanel/IConfigurationTabField";
import { IItemRepeaterSharedProps } from "../ItemRepeater/IItemRepeaterProps";

export interface IFormDataCollectionSharedProps<T> {
    
    /**
     * The item repeater props
     */
    itemRepeaterProps?: Partial<IItemRepeaterSharedProps<T>>;

    /**
     * The field label to display
     */
    label?: string

    /**
     * Key to force a re render of the component and recreate rows from items. Useful if your default items are initialized in the parent componentDidMount method
     */
    stateKey?: string;

    /**
     * The form confirugration to display items
     */
    formConfiguration: IConfigurationTabField[];

    /**
     * Flag indicating if form errors should be validated on load and the caller notified
     */
    validateOnLoad?: boolean;

    /**
     * Function returning a new instance of item of type T when a new row is added. New row fields will be initialized this this data.
     * @returns the new object instance of type T
     */
    newRowDefaultObject?: () => T;

    /**
     * Default items to render
     */
    items: T[];

    /**
     * Validates errors on the whole form related according ot the current data of type T
     * @param value the object value
     * @returns an empty string if no error, a relevant error message otherwise
     */
    onGetErrorMessage?: (value: T[]) => string;

    /**
     * Callback handler when a new row is added
     * @param rowId the new row id
     */
    onRowAdded?: (rowId: string) => void;

    
    /***
     * Callback handler when the values are reorded
     */
    onRowsOrderChanged?: (value: T[]) => void;
}

export interface IFormDataCollectionProps<T> extends IFormDataCollectionSharedProps<T> {

    /***
     * Callback handler when the values are updated
     */
    onChange: (value: T[], errors?: Map<string,string>) => void;
}