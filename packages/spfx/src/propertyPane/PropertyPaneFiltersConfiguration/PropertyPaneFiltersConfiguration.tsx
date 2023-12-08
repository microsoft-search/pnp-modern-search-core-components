import {
    IPropertyPaneField,
    PropertyPaneFieldType
  } from '@microsoft/sp-property-pane';
import * as ReactDom from 'react-dom';
import * as React from 'react';
import { IPropertyPaneFiltersConfigurationProps } from './IPropertyPaneFiltersConfigurationProps';
import { IPropertyPaneFiltersConfigurationInternalProps } from './IPropertyPaneFiltersConfigurationInternalProps';
import { FilterSortDirection, FilterSortType, IDataFilterAggregation, IDataFilterConfiguration } from '@pnp/modern-search-core/dist/es6/models/common/IDataFilterConfiguration';
import { BuiltinFilterTemplates } from '@pnp/modern-search-core/dist/es6/models/common/BuiltinTemplate';
import { FilterConditionOperator } from '@pnp/modern-search-core/dist/es6/models/common/IDataFilter';
import { ITextFieldProps, IChoiceGroupOptionProps, IToggleProps, ISliderProps, IDropdownProps, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { isEmpty, isEqual } from '@microsoft/sp-lodash-subset';
import { LocalizedStringHelper } from '@pnp/modern-search-core/dist/es6/helpers/LocalizedStringHelper';
import { ILocalizedString } from '@pnp/modern-search-core/dist/es6/models/common/ILocalizedString';
import { ConfigurationPanel } from '../../controls/ConfigurationPanel/ConfigurationPanel';
import { IConfigurationTab } from '../../controls/ConfigurationPanel/IConfigurationTab';
import { IConfigurationTabField, ConfigurationFieldType } from '../../controls/ConfigurationPanel/IConfigurationTabField';
import { FormDataCollection } from '../../controls/FormDataCollection/FormDataCollection';
import { IFormDataCollectionProps } from '../../controls/FormDataCollection/IFormDataCollectionProps';
import { IconPlacement, IItemRepeaterSharedProps } from '../../controls/ItemRepeater/IItemRepeaterProps';
import { ItemRepeater } from '../../controls/ItemRepeater/ItemRepeater';
import { ILocalizedFieldProps } from '../../controls/LocalizedTextField/ILocalizedFieldProps';
import { BaseComponentContext } from '@microsoft/sp-component-base';

//#region Fields validation

const getErrorMessage = (value: string): string => {
    return !isEmpty(value) ? '' : `Field must have a value`;
};

// Check if translation has a default value
const localizedStringGetErrorMessage = (value: string | ILocalizedString): string => {
    return !isEmpty(LocalizedStringHelper.isLocalizedString(value) ? (value as ILocalizedString).default : value) ? '' : `Field must have a value`;  
};

// Check if all aggregations have a name
const aggregationsGetErrorMessage = (values: IDataFilterAggregation[]): string => {
    return values.some(value => isEmpty(value.aggregationName)) ? `All aggregations must have a name` : '';
};

//#endregion

export class PropertyPaneFiltersConfiguration implements IPropertyPaneField<IPropertyPaneFiltersConfigurationProps> {

    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public shouldFocus?: boolean;
    public properties: IPropertyPaneFiltersConfigurationInternalProps;
    private elem: HTMLElement;

    private _itemRepeaterRef = React.createRef<ItemRepeater<IDataFilterConfiguration>>();
    private _lastCreatedConfigurationPanelRef: React.RefObject<ConfigurationPanel<IDataFilterConfiguration>> = null;
    private _lastRowId: string;

    private newFilterBaseConfiguration: IDataFilterConfiguration;
    private filterTabsConfiguration: IConfigurationTab[];
    private mainFormFields: IConfigurationTabField[];

    constructor(targetProperty: string, properties: IPropertyPaneFiltersConfigurationProps) {

        this.targetProperty = targetProperty;
        this.properties = {
            key: targetProperty,
            onRender: this.onRender.bind(this),
            onDispose: this.onDispose.bind(this),
            ...properties
        };
        

        this.newFilterBaseConfiguration = {
            filterName: "",
            displayName: "",
            isMulti: false,
            maxBuckets: 50,
            operator: FilterConditionOperator.AND,
            showCount: false,
            sortBy: FilterSortType.ByCount,
            sortDirection: FilterSortDirection.Ascending,
            sortIdx: this.properties.defaultValue.length,
            template: BuiltinFilterTemplates.CheckBox,
            aggregations: []
        };

        this.filterTabsConfiguration = [
            {
                name: "Basic",
                fields: [
                    {
                        type: ConfigurationFieldType.TextField,
                        props: {
                            label: "Filter name",
                            required: true,
                            onGetErrorMessage: getErrorMessage,
                            validateOnLoad: true
                        } as Partial<ITextFieldProps>,
                        targetProperty: "filterName" 
                    },
                    {
                        type: ConfigurationFieldType.LocalizedField,
                        props: {
                            label: "Display name",
                            onGetErrorMessage: localizedStringGetErrorMessage,
                            required: true,
                            serviceScope: this.properties.serviceScope
                        } as Partial<ILocalizedFieldProps>,
                        targetProperty: "displayName"
                    },
                    {
                        type: ConfigurationFieldType.ChoiceGroup,
                        props: {
                            label: "Template",
                            options: [
                                {
                                    key: BuiltinFilterTemplates.CheckBox,
                                    text: "Checkbox",
                                    iconProps: { iconName: 'CheckboxComposite' }
                                },
                                {
                                    key: BuiltinFilterTemplates.Date,
                                    text: "Date",
                                    iconProps: { iconName: 'DateTime' }
                                }
                            ]
                        } as Partial<IChoiceGroupOptionProps>,
                        targetProperty: "template" 
                    },
                    {
                        type: ConfigurationFieldType.Toggle,
                        props: {
                            label: "Show count",
                        } as Partial<IToggleProps>,
                        targetProperty: "showCount"
                    },
                    {
                        type: ConfigurationFieldType.ChoiceGroup,
                        props: {
                            label: "Operator",
                            options: [
                                {
                                    key: FilterConditionOperator.AND,
                                    text: "AND"
                                },
                                {
                                    key: FilterConditionOperator.OR,
                                    text: "OR"
                                }
                            ]
                        } as Partial<IChoiceGroupOptionProps>,
                        targetProperty: "operator"
                    },
                    {
                        type: ConfigurationFieldType.Toggle,
                        props: {
                            label: "Is multi value",
                        } as Partial<IToggleProps>,
                        targetProperty: "isMulti"
                    },
                    {
                        type: ConfigurationFieldType.ChoiceGroup,
                        props: {
                            label: "Sort by",
                            options: [
                                {
                                    key: FilterSortType.ByCount,
                                    text: "By count"
                                },
                                {
                                    key: FilterSortType.ByName,
                                    text: "By name"
                                }
                            ]
                        } as Partial<IChoiceGroupOptionProps>,
                        targetProperty: "sortBy"
                    },
                    {
                        type: ConfigurationFieldType.ChoiceGroup,
                        props: {
                            label: "Sort direction",
                            options: [
                                {
                                    key: FilterSortDirection.Ascending,
                                    text: "Ascending"
                                },
                                {
                                    key: FilterSortDirection.Descending,
                                    text: "Descending"
                                }
                            ]
                        } as Partial<IChoiceGroupOptionProps>,
                        targetProperty: "sortDirection"
                    },
                    {
                        type: ConfigurationFieldType.Slider,
                        props: {
                            label: "Number of values"
                        } as Partial<ISliderProps>,
                        targetProperty: "maxBuckets"
                    }
                ]
            },
            {
                name: "Aggregations",
                fields: [
                    {
                        type: ConfigurationFieldType.RepeatedItem,
                        targetProperty: "aggregations",
                        props: {
                            validateOnLoad: true,
                            label: "Aggregations",
                            onGetErrorMessage: aggregationsGetErrorMessage,
                            itemRepeaterProps: {
                                addButtonLabel: "Add new aggregation",
                                removeButtonLabel:"Remove aggregation",
                                removeButtonPlacement: IconPlacement.Bottom,
                                separator: true
                            } as IItemRepeaterSharedProps<IDataFilterAggregation>,
                            formConfiguration: [
                                {
                                    type: ConfigurationFieldType.LocalizedField,
                                    targetProperty: "aggregationName",
                                    props: {
                                        serviceScope: this.properties.serviceScope,
                                        onGetErrorMessage: localizedStringGetErrorMessage,
                                        required: true
                                    } as Partial<ILocalizedFieldProps>
                                },
                                {
                                    type: ConfigurationFieldType.RepeatedItem,
                                    targetProperty: "matchingValues",
                                    props: {
                                        label: "Matching values",
                                        formConfiguration: [
                                            {
                                                type: ConfigurationFieldType.TextField,
                                                targetProperty: null,
                                                props: {
                                                    onRenderDescription: (props: ITextFieldProps): JSX.Element => {
                                                        if (/^\/.+\/$/gi.test(props.defaultValue)) {
                                                            return  <MessageBar messageBarType={MessageBarType.warning} isMultiline={false} styles={{ root: { marginTop: 5 }}}>
                                                                        Regular expression
                                                                    </MessageBar>
                                                        }

                                                        return null;
                                                      }
                                                } as ITextFieldProps
                                            }
                                        ],
                                        newRowDefaultObject: () => "",
                                        itemRepeaterProps: {
                                            addButtonLabel: "Add new value"
                                        }
                                    } as Partial<IFormDataCollectionProps<string>>
                                },
                                {
                                    type: ConfigurationFieldType.TextField,
                                    targetProperty: "aggregationValue",
                                    props: {
                                        label: "Aggregation value"
                                    } as Partial<ITextFieldProps>
                                },
                                {
                                    type: ConfigurationFieldType.TextField,
                                    targetProperty: "aggregationValueIconUrl",
                                    props: {
                                        label: "Icon Url"
                                    } as Partial<ITextFieldProps>
                                }
                            ],
                            newRowDefaultObject: () => { return {
                                aggregationName: "",
                                aggregationValue: "",
                                matchingValues: [],
                                aggregationValueIconUrl: ""
                            }}
                        } as Partial<IFormDataCollectionProps<IDataFilterAggregation>>
                    }
                ]
            }  
        ];

        // Add visibility section if connected to a vertical
        if (this.properties.verticalsConfiguration) {
            this.filterTabsConfiguration.push(
                {
                    name: "Display",
                    fields: [
                        {
                            type: ConfigurationFieldType.Dropdown,
                            targetProperty: "verticalKeys",
                            props: {
                                multiSelect: true,
                                placeholder: "Select a tab...",
                                label: "Show this filter on selected tabs",
                                options: this.properties.verticalsConfiguration.map((v) => { 
                                    return {
                                        key: v.key,
                                        text: v.tabName
                                    }
                                })
                            } as IDropdownProps
                        }
                    ]
                }
            )
        }

        this.mainFormFields = [
            {
                type: ConfigurationFieldType.Custom,
                targetProperty: null,
                onCustomRender: (field, defaultValue, onUpdate) => {

                    this._lastCreatedConfigurationPanelRef = React.createRef<ConfigurationPanel<IDataFilterConfiguration>>();

                    return  <ConfigurationPanel<IDataFilterConfiguration>
                                ref={this._lastCreatedConfigurationPanelRef}
                                configurationTabs={this.filterTabsConfiguration}
                                renderRowTitle={(filter: IDataFilterConfiguration) => { return LocalizedStringHelper.getDefaultValue(filter.displayName) }}
                                onFormSave={(formData) => { onUpdate(field, formData)}}
                                dataObject={defaultValue}
                                renderPanelTitle={() => "Add new filter"}
                                onFormDismissed={(configuration: IDataFilterConfiguration) => {
                                        
                                    if (isEqual(configuration, this.newFilterBaseConfiguration)) {
                                        // Remove row as no item has been saved
                                        this._itemRepeaterRef.current.deleteItemRow(this._lastRowId)
                                    }
                                }}
                            />;
                }
            }
        ];
    }
    
    public render(): void {
        if (!this.elem) {
            return;
        }

        this.onRender(this.elem);
    }

    private onDispose(element: HTMLElement): void {
        ReactDom.unmountComponentAtNode(element);
    }
    private onRender(elem: HTMLElement, ctx?: BaseComponentContext, changeCallback?: (targetProperty?: string, newValue?: IDataFilterConfiguration[]) => void): void {

        if (!this.elem) {
            this.elem = elem;
        }
  
        const element = <FormDataCollection<IDataFilterConfiguration> 
                            formConfiguration={this.mainFormFields}
                            itemRepeaterProps={{
                                addButtonLabel:"Add new filter",
                                enableDragDrop: true,
                                innerRef: this._itemRepeaterRef
                            }} 
                            newRowDefaultObject={(): IDataFilterConfiguration => {
                                return this.newFilterBaseConfiguration;
                            }} 
                            items={this.properties.defaultValue}
                            onChange={(value: IDataFilterConfiguration[], errors?: Map<string, string>) => {
                                changeCallback(this.targetProperty, value);
                            }}
                            onRowAdded={(rowId) => {
                                // Save the row id to be able to delete it afterwards
                                this._lastRowId = rowId;
                                // Get the last created row (empty at this point) and open the panel
                                this._lastCreatedConfigurationPanelRef.current.togglePanel();
                            }}
                            onRowsOrderChanged={(value: IDataFilterConfiguration[]) => {
                                
                                // Update the sortIdx proeprty according to the array sort order
                                const filterConfiguration = value.map((configuration, i) => {
                                    configuration.sortIdx = i;
                                    return configuration;
                                });

                                changeCallback(this.targetProperty, filterConfiguration);
                            }}
                        />;

        ReactDom.render(element, elem);
    }
}