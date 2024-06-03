export enum ConfigurationFieldType {
    Dropdown,
    TextField,
    Toggle,
    ChoiceGroup,
    Slider,
    LocalizedField,
    FilterAggregationsField,
    RepeatedItem,
    Custom
}

export interface IConfigurationTabField {

    /**
     * Type of the field to be instanciated
     */
    type: ConfigurationFieldType;
    
    /**
     * properties to pass to components
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props?: any;

    /**
     * The target property path for setting default value/save. If set to 'null', the value for that fille will the one passed to the form
     */
    targetProperty?: string;

    /**
     * Custom render function if the type is set to "Custom"
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCustomRender?: (field: IConfigurationTabField, defaultValue: any, onFieldValueUpdate: (field: IConfigurationTabField, value: any) => void) => React.ReactNode;

    /**
     * Handler to determine the visibility of the field based on the current handler
     * @param dataObject the current for data object
     * @returns 'true' if the field should be visible, 'false' otherwise
     */
    isVisible?: (dataObject: unknown) => boolean;
}