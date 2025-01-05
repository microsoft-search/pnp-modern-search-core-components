export interface IConfigurationPanelState<T> {
    
    /**
     * Flag indicating is the panel is open
     */
    isOpen: boolean;

    /**
     * The current form data being edited (not save yet)
     */
    currentformData: T;

    /**
     * The form data saved. Used as reference data to determine if updates have been made since last modification
     */
    savedformData: T;

    /**
     * The panel title
     */
    title: string;

    /**
     * Flag indicating if the form data can be saved (no errors and data updated)
     */
    canSave: boolean;

    /**
     * List of errors by tab name
     */
    errors: Map<string,Map<string,string>>
}