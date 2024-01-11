import * as React from "react";
import { IFormBuilderProps } from "./IFormBuilderProps";
import { IFormBuilderState } from "./IFormBuilderState";
import { ObjectHelper } from "@pnp/modern-search-core/dist/es6/helpers/ObjectHelper";
import { ILocalizedString } from "@pnp/modern-search-core/dist/es6/models/common/ILocalizedString";
import { TextField, Dropdown, Toggle, ChoiceGroup, Slider, Stack, IDropdown } from "office-ui-fabric-react";
import { ConfigurationFieldType, IConfigurationTabField } from "../ConfigurationPanel/IConfigurationTabField";
import { LocalizedField } from "../LocalizedTextField/LocalizedField";
import { cloneDeep, isEmpty } from "@microsoft/sp-lodash-subset";
import { FormDataCollection } from "../FormDataCollection/FormDataCollection";

export class FormBuilder<T> extends React.Component<IFormBuilderProps<T>, IFormBuilderState<T>> {

    constructor(props: IFormBuilderProps<T>) {

        super(props);

        // Important to initialize formData here to get default values working and avoid an unecessary render
        this.state = {
            formData: cloneDeep(this.props.dataObject),  // Will work with primitive types or objects
            errors: new Map<string,string>()
        };

        this.onFieldValueUpdate = this.onFieldValueUpdate.bind(this);
    }

    public componentDidMount(): void {

        const errors = this.validateFormFields(this.state.formData);

        // Initializer errors state at form load
        this.setState({
            errors: errors
        });

        if (this.props.validateOnLoad) {
            this.props.onFormValuesUpdated(this.state.formData, errors)
        }
    }

    public render(): React.ReactNode {

        const renderFields = this.props.fields.map((field, i) => {

            let renderField = null;
            let defaultFieldValue = null;
            const isVisible = field.isVisible ? field.isVisible(this.state.formData) : true;

            // No target property means primitive type (ex; 'string')
            if (field.targetProperty) {
                // This method should return the original property type
                defaultFieldValue = ObjectHelper.getPropertyByPath(this.state.formData, field.targetProperty);
            } else {
                defaultFieldValue = this.state.formData;
            }
   
            switch (field.type) {

                case ConfigurationFieldType.TextField:
                    renderField = <TextField 
                                    {...field.props}                                    
                                    onChange={(ev, newValue) => {
                                        this.onFieldValueUpdate(field, newValue);
                                    }}
                                    defaultValue={defaultFieldValue}
                                />;
                    break
                
                case ConfigurationFieldType.Dropdown: {

                    const dropDownRef = React.createRef<IDropdown>();
    
                    renderField =   <Dropdown 
                                        componentRef={dropDownRef}
                                        {...field.props}
                                        defaultSelectedKey={defaultFieldValue}
                                        defaultSelectedKeys={defaultFieldValue}
                                        onChange={(ev, option) => {

                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            let value: any = option.key;
                                            if (field.props?.multiSelect) {
                                                value =  dropDownRef.current.selectedOptions.map(o => o.key);
                                            }
                                            
                                            this.onFieldValueUpdate(field, value);
                                            
                                        }}
                                    />
                    }
                    break;

                case ConfigurationFieldType.Toggle: 
                                                        
                    renderField =   <Toggle 
                                        {...field.props}
                                        defaultChecked={defaultFieldValue}
                                        onChange={(ev, checked) => {
                                            this.onFieldValueUpdate(field, checked);
                                        }}
                                    />;
                    break;

                case ConfigurationFieldType.ChoiceGroup:

                    renderField =   <ChoiceGroup
                                        {...field.props}
                                        defaultSelectedKey={defaultFieldValue}
                                        onChange={(ev, option) => {
                                            this.onFieldValueUpdate(field, option.key);
                                        }}
                                    />;
                    break;

                case ConfigurationFieldType.Slider:

                    renderField =   <Slider 
                                        {...field.props}
                                        defaultValue={defaultFieldValue}
                                        onChange={(value: number) => {
                                            this.onFieldValueUpdate(field, value);
                                        }}
                                    />;
                    break; 

                case ConfigurationFieldType.LocalizedField:

                    renderField =   <LocalizedField 
                                        {...field.props}
                                        defaultValue={Array.isArray(defaultFieldValue) ? defaultFieldValue[0] : defaultFieldValue}
                                        onChange={(value: string | ILocalizedString) => {
                                            this.onFieldValueUpdate(field, value);
                                        }}
                                    />;
                    break; 
                

                case ConfigurationFieldType.RepeatedItem:

                        renderField =   <FormDataCollection<T>
                                            {...field.props}
                                            items={isEmpty(defaultFieldValue) ? [] : defaultFieldValue}
                                            onChange={(value: T[]) => {
                                                this.onFieldValueUpdate(field, value);
                                            }}
                                        />;
                    break;

                case ConfigurationFieldType.Custom:
                        renderField = field.onCustomRender(field, defaultFieldValue, this.onFieldValueUpdate);

                    break;
                
                default:
                    break
            }

            return isVisible ? renderField : null;
        });

        return <Stack>{renderFields}</Stack>;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private onFieldValueUpdate(field: IConfigurationTabField, value: any): void {

        // Value can be a primitive type or an object
        let formData = value;

        if (field.targetProperty) {
            formData = ObjectHelper.setPropertyByPath(this.state.formData, field.targetProperty, value);
        }
        const errors = this.validateFormFields(formData);         
        
        this.setState({
            formData: cloneDeep(formData), // Will work with primitive types or objects
            errors: errors
        }, () => {
            this.props.onFormValuesUpdated(formData, errors);
        });
    }

    /**
     * Validate all fields if they have any errors
     * @param formData the current form data
     * @returns 
     */
    private validateFormFields(formData: T): Map<string,string> {

        const errors = cloneDeep(this.state.errors);
        
        this.props.fields.forEach(field => {

            const clearFieldError = (targetProperty: string): void => {
                if (errors.get(targetProperty)) {
                    errors.delete(targetProperty);
                }
            };
            
            const isFieldVisible = field.isVisible ? field.isVisible(formData) : true; 

            if (field?.props?.onGetErrorMessage) {

                if (isFieldVisible) {

                    let value = formData;
                    if (field.targetProperty) {
                        value = ObjectHelper.getPropertyByPath(formData, field.targetProperty);
                    }
                    
                    const errorMessage = field.props.onGetErrorMessage(value);
                    if (errorMessage !== '') {
    
                        // Add the error for that field in the errors list
                        if (!errors.get(field.targetProperty)) {
                            errors.set(field.targetProperty, errorMessage);
                        }
                    } else {                        
                        clearFieldError(field.targetProperty);
                    }
                } else {
                    clearFieldError(field.targetProperty);
                }
            }
        });
        
        return errors;
    }
}