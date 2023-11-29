import { IPropertyPaneField, IPropertyPaneGroup, PropertyPaneCheckbox, PropertyPaneSlider, PropertyPaneChoiceGroup, PropertyPaneDynamicField, PropertyPaneHorizontalRule, PropertyPaneLabel, PropertyPaneTextField, PropertyPaneToggle, PropertyPaneDropdown, IPropertyPaneDropdownProps } from "@microsoft/sp-property-pane";
import { BaseDataSource } from "../models/common/BaseDataSource";
import { IChoiceGroupProps, IComboBoxOption, ITextFieldProps, IToggleProps } from "@fluentui/react";
import * as sourceStrings from 'MicrosoftSearchDataSourceStrings';
import { DynamicProperty } from "@microsoft/sp-component-base";
import { intersection, isEmpty, isEqual } from "@microsoft/sp-lodash-subset";
import { ServiceScope } from "@microsoft/sp-core-library";
import { EntityType, IQueryAlterationOptions } from "pnp-modern-search-core/dist/es6/models/search/IMicrosoftSearchRequest";
import IDynamicDataService from "../services/dynamicDataService/IDynamicDataService";
import { DynamicDataService } from "../services/dynamicDataService/DynamicDataService";
import { ComponentType } from "../common/ComponentType";
import { ConfigurationFieldType, IConfigurationTabField } from "../controls/ConfigurationPanel/IConfigurationTabField";
import { PropertyPaneCombobox } from "../propertyPane/PropertyPaneCombobox/PropertyPaneCombobox";
import { PropertyPaneFormDataCollection } from "../propertyPane/PropertyPaneFormDataCollection/PropertyPaneFormDataCollection";
import { PropertyPaneNonReactiveTextField } from "../propertyPane/PropertyPaneNonReactiveTextField/PropertyPaneNonReactiveTextField";
import { ISortFieldConfiguration, SortFieldDirection } from "pnp-modern-search-core/dist/es6/models/common/ISortFieldConfiguration";
import * as React from "react";
import { ConfigurationPanel } from "../controls/ConfigurationPanel/ConfigurationPanel";
import { IConfigurationTab } from "../controls/ConfigurationPanel/IConfigurationTab";
import { ILocalizedFieldProps } from "../controls/LocalizedTextField/ILocalizedFieldProps";
import { ItemRepeater } from "../controls/ItemRepeater/ItemRepeater";

export enum QueryTextSource {
    StaticValue,
    DynamicValue
}

export enum QueryMode {
    Basic,
    Advanced
}

export interface IPagingSettings {

    /**
     * Flag indicating if the pagniation control should be displayed
     */
    showPaging: boolean;

    /**
     * The number of pages to display in the pagination control
     */
    numberOfPagesToDisplay: number;

    /**
     * The number of results to show per results page
     */
    pageSize: number;
}

export interface IExternalContentSource {
    id: string;
}

export interface IMicrosoftSearchDataSourceProperties {

    /**
     * Flag indicating if a default query text should be applied
     */
    useDefaultQueryText: boolean;

    /**
     * The input query text to pass to the data source
     */
    queryText: DynamicProperty<string>;

    /**
     *  The default query text to apply
     */
    defaultQueryText: string;

    /**
    * Indicates ifthe query text comes from a static or dynamic value
    */
    queryTextSource: QueryTextSource;

    /**
    * The search query template
    */
    queryTemplate: string;

    /**
     * The entity types to search
     */
    entityTypes: EntityType[];

    /**
     * If "entityTypes" contains "externalItem", specify the connection ids of the external sources
     */
    contentSources: string[];

    /**
     * Search managed properties to retrieve for results and usable in the results template. 
     * Comma separated. Refer to the [Microsoft Search API documentation](https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-1.0&preserve-view=true#scope-search-based-on-entity-types) to know what properties can be used according to entity types.
     */
    selectedFields: string[];

    /**
     * The query building mode
     */
    queryMode: QueryMode;

    /**
     * Paging settings
     */
    paging: IPagingSettings;

    /**
     * Flag indicating if the beta endpoint for Microsoft Graph API should be used
     */
    useBetaEndpoint: boolean;

    /**
     * Flag indicating if Micrsoft Search result types should be applied in results
     */
    enableResultTypes: boolean;

    /**
     * The query alteration options for spelling corrections
     */
    queryAlterationOptions: IQueryAlterationOptions;

    /**
     * Determines if the Web Part should use filters component connection
     */
    useFilters: boolean;

    /**
     * Dynamic data connection references for filters
     */
    filtersDataSourceReference: string;

    /**
     * Sort properties for the request
     */
    sortFieldsConfiguration?: ISortFieldConfiguration[];
}

export class MicrosoftSearchDataSource extends BaseDataSource<IMicrosoftSearchDataSourceProperties> {

    private _entityTypeOptions: IComboBoxOption[] = [
        {
            key: EntityType.Message,
            text: "Messages",
            disabled: false
        },
        {
            key: EntityType.Event,
            text: "Events",
            disabled: false
        },
        {
            key: EntityType.Drive,
            text: "Drive",
            disabled: false
        },
        {
            key: EntityType.DriveItem,
            text: "Drive Items",
            disabled: false
        },
        {
            key: EntityType.ExternalItem,
            text: "External Items",
            disabled: false
        },
        {
            key: EntityType.ListItem,
            text: "List Items",
            disabled: false
        },
        {
            key: EntityType.List,
            text: "List",
            disabled: false
        },
        {
            key: EntityType.Site,
            text: "Sites",
            disabled: false
        },
        {
            key: EntityType.Person,
            text: "People"
        },
        {
            key: EntityType.TeamsMessage,
            text: "Teams messages"
        },
        {
            key: EntityType.Bookmark,
            text: "Bookmarks"
        },
        {
            key: EntityType.Acronym,
            text: "Acronyms"
        }
    ];
    
    // https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-1.0#known-limitations
    private _entityTypesExclusions: Map<EntityType, EntityType[]> = new Map<EntityType, EntityType[]>(
        [
            [EntityType.Bookmark, [EntityType.Bookmark]],
            [EntityType.Acronym, [EntityType.Acronym]],
            [EntityType.Person, [EntityType.Person]],
            [EntityType.Message, [EntityType.Message]],
            [EntityType.TeamsMessage, [EntityType.TeamsMessage]],
            [EntityType.Event, [EntityType.Event]],
            [EntityType.Drive, [EntityType.Drive,EntityType.DriveItem,EntityType.ExternalItem,EntityType.ListItem,EntityType.List,EntityType.Site]],
            [EntityType.DriveItem, [EntityType.Drive,EntityType.DriveItem,EntityType.ExternalItem,EntityType.ListItem,EntityType.List,EntityType.Site]],
            [EntityType.ExternalItem, [EntityType.Drive,EntityType.DriveItem,EntityType.ExternalItem,EntityType.ListItem,EntityType.List,EntityType.Site]],
            [EntityType.List, [EntityType.Drive,EntityType.DriveItem,EntityType.ExternalItem,EntityType.ListItem,EntityType.List,EntityType.Site]],
            [EntityType.ListItem, [EntityType.Drive,EntityType.DriveItem,EntityType.ExternalItem,EntityType.ListItem,EntityType.List,EntityType.Site]],
            [EntityType.Site, [EntityType.Drive,EntityType.DriveItem,EntityType.ExternalItem,EntityType.ListItem,EntityType.List,EntityType.Site]],
        ]
    );

    private _selectedFieldsOptions : IComboBoxOption[] = [];

    /**
     * The dynamic data service instance
     */
    private dynamicDataService: IDynamicDataService;

    /**
     * Property pane fields
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _propertyFieldNumber: any = null;
    private propertyPaneFiltersConnectionField: IPropertyPaneField<unknown>;

    private _itemRepeaterRef = React.createRef<ItemRepeater<ISortFieldConfiguration>>();
    private _lastCreatedConfigurationPanelRef: React.RefObject<ConfigurationPanel<ISortFieldConfiguration>> = null;
    private _lastRowId: string;

    public constructor(serviceScope: ServiceScope) {
        super(serviceScope);

        serviceScope.whenFinished(() => {
            this.dynamicDataService = serviceScope.consume<IDynamicDataService>(DynamicDataService.ServiceKey);
        });
    }

    public async onInit(): Promise<void> {

        this.initializeProperties();

        await this.loadPropertyPaneResources();
    }

    public async onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown) : Promise<void> {

        // Remove the connection when static query text or unused
        if ((propertyPath.localeCompare('queryTextSource') === 0 && this.properties.queryTextSource === QueryTextSource.StaticValue) ||
            (propertyPath.localeCompare('queryTextSource') === 0 && oldValue === QueryTextSource.StaticValue && newValue === QueryTextSource.DynamicValue)) {

            this.properties.queryText.setValue('');
            this.render();
        }

        if (this.properties.queryTextSource === QueryTextSource.StaticValue 
            || !this.properties.useDefaultQueryText) {
            // Reset the default query text
            this.properties.defaultQueryText = undefined;
        }

        if (propertyPath.localeCompare('contentSources') === 0) {
            this.properties.contentSources = this.properties.contentSources.map(v => `/external/connections/${v}`);
        }

        // Refresh list of available connections
        this.propertyPaneFiltersConnectionField = await this.getFiltersConnectionField();
        this.context.propertyPane.refresh();
    }

    public getPropertyPaneGroupsConfiguration(): IPropertyPaneGroup[] {

        return [
            this.getQuerySettingsGroup(),
            this.getAdvancedSettings(),
            this.getPagingSettings()
        ]
    }

    private getQuerySettingsGroup(): IPropertyPaneGroup {

        const groupFields: IPropertyPaneField<unknown>[] = [

            PropertyPaneChoiceGroup('queryMode', {
                options: [
                    {
                        key: QueryMode.Basic,
                        text: "Basic mode (coming soon...)",
                        disabled: true
                    },
                    {
                        key: QueryMode.Advanced,
                        text: "Advanced mode"
                    }
                ]
            })
        ];

        switch (this.properties.queryMode) {

            case QueryMode.Basic:
                // Show query builder
                groupFields.push(
                    PropertyPaneHorizontalRule()
                );
                break;
            
            case QueryMode.Advanced:
                groupFields.push(
                    PropertyPaneHorizontalRule(),
                    new PropertyPaneCombobox('entityTypes', {
                        label: sourceStrings.PropertyPane.QuerySettingsGroup.SearchEntityTypeFieldLabel,
                        options: this._entityTypeOptions,
                        onResolveOptions: (options: IComboBoxOption[]) => {

                            // Determine what entity types are allowed according to exclusions list and current selected values
                            const allowedFromExclusions = this.properties.entityTypes.length > 0 ? intersection(this.properties.entityTypes.map(entity => this._entityTypesExclusions.get(entity))[0]) : this._entityTypeOptions.map(e => e.key);
                            return options.map(option => {
                                option.disabled = allowedFromExclusions.indexOf(option.key as EntityType) === -1
                                return option;
                            });
                        },
                        defaultSelectedKey: this.properties.entityTypes,
                        useComboBoxAsMenuWidth: true,
                        multiSelect: true
                    }),
                    ...this.getSearchQueryTextFields(),
                    new PropertyPaneNonReactiveTextField('queryTemplate', {
                        componentKey: "microsoftSearch-queryTemplate",
                        defaultValue: this.properties.queryTemplate,
                        label: sourceStrings.PropertyPane.QuerySettingsGroup.SearchQueryTemplateFieldLabel,
                        placeholderText:  sourceStrings.PropertyPane.QuerySettingsGroup.SearchQueryTemplatePlaceHolderText,
                        multiline: true,
                        description: sourceStrings.PropertyPane.QuerySettingsGroup.SearchQueryTemplateFieldDescription,
                        applyBtnText: sourceStrings.PropertyPane.QuerySettingsGroup.SearchQueryQueryTemplateApplyBtnText,
                        allowEmptyValue: false,
                        rows: 8
                    })
                );
                break;

            default:
                break;
        }

        const getErrorMessage = (value: string): string => {
            return !isEmpty(value) ? '' : `Field must have a value`;
        };
        

        if (this.properties.entityTypes.indexOf(EntityType.ExternalItem) !== -1) {
            groupFields.splice(3, 0, new PropertyPaneFormDataCollection<string>('contentSources', {
                label: sourceStrings.PropertyPane.QuerySettingsGroup.SearchContentSourcesFieldLabel,
                itemRepeaterProps: {
                    addButtonLabel: sourceStrings.PropertyPane.QuerySettingsGroup.SearchContentSourcesAddNewBtnLabel,    
                },
                items: this.properties.contentSources,
                newRowDefaultObject: () => "",
                formConfiguration: [
                    {
                        type: ConfigurationFieldType.TextField,
                        targetProperty: null,
                        props: {
                            onGetErrorMessage: getErrorMessage
                        } as ITextFieldProps
                    }
                ],
            }));
        }

        return {

            groupName: sourceStrings.PropertyPane.QuerySettingsGroup.GroupName,
            groupFields: groupFields
        };
    }

    private getAdvancedSettings(): IPropertyPaneGroup {

        const advancedGroupFields = [
            new PropertyPaneCombobox('selectedFields', {
                label: sourceStrings.PropertyPane.AdvancedSettingsGroup.SearchSelectedFieldsFieldLabel,
                options: this._selectedFieldsOptions,
                onValueChange: (options: IComboBoxOption[]) => {
                    this._selectedFieldsOptions = options;
                },
                useComboBoxAsMenuWidth: true,
                allowFreeform: true,
                autoComplete: 'on',
                placeholder: sourceStrings.PropertyPane.AdvancedSettingsGroup.SearchSelectedFieldsPlaceholderLabel,
                multiSelect: true,
            }),
            PropertyPaneToggle('useFilters', {
                label: sourceStrings.PropertyPane.AdvancedSettingsGroup.SearchFiltersUseFiltersFieldLabel,
                checked: this.properties.useFilters
            }),
            this.getSearchSortConfigurationField(),
            PropertyPaneToggle('enableResultTypes', {
                label: sourceStrings.PropertyPane.AdvancedSettingsGroup.SearchEnableResultTypesFieldLabel,
                checked: this.properties.enableResultTypes
            }),
            PropertyPaneToggle('useBetaEndpoint', {
                label: sourceStrings.PropertyPane.AdvancedSettingsGroup.SearchUseBetaEndpointFieldLabel
            }),
            PropertyPaneToggle('queryAlterationOptions.enableSuggestion', {
                label: sourceStrings.PropertyPane.AdvancedSettingsGroup.SearchEnableSuggestionFieldLabel,
                checked: this.properties.queryAlterationOptions.enableSuggestion
            }),
            PropertyPaneToggle('queryAlterationOptions.enableModification', {
                label: sourceStrings.PropertyPane.AdvancedSettingsGroup.SearchEnableModificationFieldLabel,
                checked: this.properties.queryAlterationOptions.enableModification
            })
        ];

        if (this.properties.useFilters) {
            advancedGroupFields.splice(2, 0, this.propertyPaneFiltersConnectionField);
        }

        return {
            groupName: sourceStrings.PropertyPane.AdvancedSettingsGroup.GroupName,
            groupFields: advancedGroupFields,
            isCollapsed: false
        }
    }

    private getPagingSettings(): IPropertyPaneGroup {

        return {
            groupName: sourceStrings.PropertyPane.PagingSettingsGroup.GroupName,
            groupFields: [
                PropertyPaneToggle('paging.showPaging', {
                    label: sourceStrings.PropertyPane.PagingSettingsGroup.SearchShowPagingFieldLabel,
                }),
                this._propertyFieldNumber('paging.pageSize', {
                    label: sourceStrings.PropertyPane.PagingSettingsGroup.SearchPageSizeFieldLabel,
                    maxValue: 500,
                    minValue: 1,
                    deferredValidationTime: 500,
                    value: this.properties.paging.pageSize,
                    disabled: !this.properties.paging.showPaging,
                    key: 'paging.pageSize'
                }),
                PropertyPaneSlider('paging.numberOfPagesToDisplay', {
                    label: sourceStrings.PropertyPane.PagingSettingsGroup.SearchPagesNumberFieldLabel,
                    max: 20,
                    min: 1, // 0 = no page numbers displayed
                    step: 1,
                    showValue: true,
                    value: this.properties.paging.numberOfPagesToDisplay,
                    disabled: !this.properties.paging.showPaging
                })
            ],
            isCollapsed: false
        }
    }

    private getSearchQueryTextFields(): IPropertyPaneField<unknown>[] {

        const searchQueryTextFields: IPropertyPaneField<unknown>[] = [
    
            PropertyPaneLabel('', {
                text: sourceStrings.PropertyPane.QuerySettingsGroup.SearchQueryTextFieldLabel
            })
        ];
    
        searchQueryTextFields.push(

            PropertyPaneChoiceGroup('queryTextSource', {
                options: [
                    {
                        key: QueryTextSource.StaticValue,
                        text: sourceStrings.PropertyPane.QuerySettingsGroup.SearchQueryTextStaticValue
                    },
                    {
                        key: QueryTextSource.DynamicValue,
                        text: sourceStrings.PropertyPane.QuerySettingsGroup.SearchQueryTextDynamicValue
                    }
                ]
            })
        );
    
        switch (this.properties.queryTextSource) {
    
            case QueryTextSource.StaticValue:
                searchQueryTextFields.push(
                    PropertyPaneTextField('queryText', {
                        label: '',
                        description: sourceStrings.PropertyPane.QuerySettingsGroup.SearchQueryTextFieldDescription,
                        multiline: true,
                        resizable: true,
                        placeholder: sourceStrings.PropertyPane.QuerySettingsGroup.SearchQueryPlaceHolderText,
                        onGetErrorMessage: this._validateEmptyField.bind(this),
                        deferredValidationTime: 500
                    })
                );
                break;
    
            case QueryTextSource.DynamicValue:
                searchQueryTextFields.push(

                    // Workaround: save the value in the root dynamic property of the Web Part (the default value won't be saved otherwise after a page refresh)
                    PropertyPaneDynamicField('queryText', { 
                        label: '',
                    }),
                    PropertyPaneCheckbox('useDefaultQueryText', {
                        text: sourceStrings.PropertyPane.QuerySettingsGroup.SearchQueryTextUseDefaultQuery,
                        disabled: this.properties.queryText.reference === undefined
                    })
                );
    
                if (this.properties.useDefaultQueryText && this.properties.queryText.reference !== undefined) {
                    searchQueryTextFields.push(
                        PropertyPaneTextField('defaultQueryText', {
                            label: sourceStrings.PropertyPane.QuerySettingsGroup.SearchQueryTextDefaultValue,
                            multiline: true
                        })
                    );
                }
    
                break;
    
            default:
                break;
        }
        
        return searchQueryTextFields;
    }

    private getSearchSortConfigurationField(): IPropertyPaneField<unknown> {

        const getErrorMessage = (value: string): string => {
            return !isEmpty(value) ? '' : `Field must have a value`;
        };
          
        const newSortFieldConfiguration: ISortFieldConfiguration = {
            isDefaultSort: false,
            isUserSort: false,
            sortDirection: SortFieldDirection.Ascending,
            sortField: "",
            sortFieldDisplayName: ""
        };
      
        const sortFieldTabConfiguration: IConfigurationTab[] = [
            {
                name: "General",
                fields: [
                {
                    type: ConfigurationFieldType.TextField,
                    props: {
                        label: "Sort field",
                        required: true,
                        onGetErrorMessage: getErrorMessage,
                    } as Partial<ITextFieldProps>,
                    targetProperty: "sortField",
                },
                {
                    type: ConfigurationFieldType.ChoiceGroup,
                    props: {
                        label: "Sort direction",
                        options: [{key: SortFieldDirection.Ascending, text: "Ascending"},{key: SortFieldDirection.Descending, text: "Descending"}]
                    } as Partial<IChoiceGroupProps>,
                    targetProperty: "sortDirection" 
                },
                {
                    type: ConfigurationFieldType.Toggle,
                    props: {
                        label: "Is default sort",
                    } as Partial<IToggleProps>,
                    targetProperty: "isDefaultSort"
                },
                                {
                    type: ConfigurationFieldType.Toggle,
                    props: {
                        label: "Is user sort",
                    } as Partial<IToggleProps>,
                    targetProperty: "isUserSort"
                },
                {
                    type: ConfigurationFieldType.LocalizedField,
                    props: {
                        serviceScope: this.context.serviceScope,
                        label: "Display name",
                        onGetErrorMessage: getErrorMessage,
                        required: true,
                    } as Partial<ILocalizedFieldProps>,
                    targetProperty: "sortFieldDisplayName",
                    isVisible: (dataObject: ISortFieldConfiguration) => {
                        return dataObject.isUserSort;
                    }
                },
                ]
            },
        ];
    
        const mainFormFields: IConfigurationTabField[] = [
        {
            type: ConfigurationFieldType.Custom,
            targetProperty: null,
            onCustomRender: (field, defaultValue, onUpdate) => {
    
                this._lastCreatedConfigurationPanelRef = React.createRef<ConfigurationPanel<ISortFieldConfiguration>>();
    
                return  <ConfigurationPanel<ISortFieldConfiguration>
                            ref={this._lastCreatedConfigurationPanelRef}
                            configurationTabs={sortFieldTabConfiguration}
                            renderRowTitle={(sortField: ISortFieldConfiguration) => { return sortField.sortField }}
                            onFormSave={(formData) => { onUpdate(field, formData)}}
                            dataObject={defaultValue}
                            renderPanelTitle={() => "Add new sort property"}
                            onFormDismissed={(configuration: ISortFieldConfiguration) => {
                                if (isEqual(configuration, newSortFieldConfiguration)) {
                                    // Remove row as no item has been saved
                                    this._itemRepeaterRef.current.deleteItemRow(this._lastRowId)
                                }
                            }}
                        />;
            }
        }
        ];

        return new PropertyPaneFormDataCollection<ISortFieldConfiguration>('sortFieldsConfiguration', {
            label: "Sort properties",
            itemRepeaterProps: {
                innerRef: this._itemRepeaterRef,
                addButtonLabel: "Add new sort property",    
                enableDragDrop: true
            },
            items: this.properties.sortFieldsConfiguration,
            newRowDefaultObject: () => newSortFieldConfiguration,
            formConfiguration: mainFormFields,
            onRowAdded: (rowId: string) => {
                // Save the row id to be able to delete it afterwards
                this._lastRowId = rowId;
                // Get the last created row (empty at this point) and open the panel
                this._lastCreatedConfigurationPanelRef.current.togglePanel();
            },
            onRowsOrderChanged: (value: ISortFieldConfiguration[]) => {                        
                this.properties.sortFieldsConfiguration = value;
                this.render()
            }
        });
    }

    private initializeProperties(): void {

        // Initialize dynamic properties
        if (!this.properties.queryText) {
            this.properties.queryText = new DynamicProperty<string>(this.context.dynamicDataProvider);
            this.properties.queryText.setValue('');
        }
        
        this.properties.queryTextSource = this.properties.queryTextSource ? this.properties.queryTextSource : QueryTextSource.StaticValue;
        this.properties.queryTemplate = this.properties.queryTemplate ? this.properties.queryTemplate : "{searchTerms}";
        
        this.properties.queryMode = this.properties.queryMode !== undefined ? this.properties.queryMode : QueryMode.Advanced;

        this.properties.entityTypes = this.properties.entityTypes !== undefined ? this.properties.entityTypes : [EntityType.DriveItem];
        this.properties.contentSources = this.properties.contentSources !== undefined ? this.properties.contentSources : []; 
    
        this.properties.selectedFields = this.properties.selectedFields !== undefined ? this.properties.selectedFields : [
            "name",
            "webUrl",
            "title",
            "summary",
            "created",
            "createdBy",
            "filetype",
            "defaultEncodingURL",
            "lastModifiedTime",
            "modifiedBy",
            "path",
            "hitHighlightedSummary",
            "SPSiteURL",
            "SiteTitle"
        ];
        this._selectedFieldsOptions = this.properties.selectedFields.map(field => { return {key: field, text: field, selected: true}});
        
        this.properties.useBetaEndpoint = this.properties.useBetaEndpoint !== undefined ? this.properties.useBetaEndpoint : false;
        this.properties.queryAlterationOptions = this.properties.queryAlterationOptions ?? { enableModification: false, enableSuggestion: false };

        if (!this.properties.paging) {

            this.properties.paging = {
                pageSize: 10,
                numberOfPagesToDisplay: 5,
                showPaging: true,
            };
        }

        this.properties.sortFieldsConfiguration = this.properties.sortFieldsConfiguration !== undefined ? this.properties.sortFieldsConfiguration: []; 
    }

    public async loadPropertyPaneResources(): Promise<void> {

        const { PropertyFieldNumber } = await import(
            /* webpackChunkName: 'pnp-modern-search-core-property-pane' */
            '@pnp/spfx-property-controls/lib/PropertyFieldNumber'
        );

        this._propertyFieldNumber = PropertyFieldNumber;
        this.propertyPaneFiltersConnectionField = await this.getFiltersConnectionField();
    }

    /**
     * Checks if a field if empty or not
     * @param value the value to check
     */
    private _validateEmptyField(value: string): string {

        if (!value) {
            return sourceStrings.General.EmptyFieldErrorMessage;
        }

        return '';
    }

    private async getFiltersConnectionField(): Promise<IPropertyPaneField<IPropertyPaneDropdownProps>> {

        return PropertyPaneDropdown('filtersDataSourceReference', {
            options: await this.dynamicDataService.getAvailableDataSourcesByType(ComponentType.SearchFilters),
            label: sourceStrings.PropertyPane.AdvancedSettingsGroup.SearchFiltersFieldsFieldLabel
        });
    }
} 