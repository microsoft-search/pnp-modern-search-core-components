//#region Imports
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration, IPropertyPaneField, PropertyPaneChoiceGroup, PropertyPaneDropdown, PropertyPaneToggle} from '@microsoft/sp-property-pane';
import * as webPartStrings from 'SearchFiltersWebPartStrings';
import SearchFilters from './components/SearchFilters';
import { ISearchFiltersProps } from './components/ISearchFiltersProps';
import { BaseWebPart } from '../../common/BaseWebPart';
import { IDynamicDataCallables, IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';
import { ComponentType } from '../../common/ComponentType';
import { FilterSortDirection, FilterSortType } from '@pnp/modern-search-core/dist/es6/models/common/IDataFilterConfiguration';
import { BuiltinFilterTemplates } from '@pnp/modern-search-core/dist/es6/models/common/BuiltinTemplate';
import { FilterConditionOperator } from '@pnp/modern-search-core/dist/es6/models/common/IDataFilter';
import { DynamicProperty } from '@microsoft/sp-component-base';
import { IPlaceholderProps } from '@pnp/spfx-controls-react';
import PlaceHolder from '../../controls/WebPartPlaceholder/WebPartPlaceholder';
import { IComboBoxOption } from 'office-ui-fabric-react';
import { IPropertyFieldMultiSelectProps, PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
import { ISearchFiltersWebPartProps } from './ISearchFiltersWebPartProps';
import { PropertyPaneFiltersConfiguration } from '../../propertyPane/PropertyPaneFiltersConfiguration/PropertyPaneFiltersConfiguration';
import { ISearchVerticalSourceData } from '../../models/dynamicData/ISearchVerticalSourceData';
import { IDataVerticalConfiguration } from '@pnp/modern-search-core/dist/es6/models/common/IDataVerticalConfiguration';
import { ILayoutDefinition, LayoutType } from '../../models/common/ILayoutDefinition';
import { AvailableLayouts, BuiltinLayoutsKeys } from '../../layouts/AvailableLayouts';

//#endregion

export default class SearchFiltersWebPart extends BaseWebPart<ISearchFiltersWebPartProps> implements IDynamicDataCallables {

  //#region Class attributes

  /**
   * Dynamic properties for all connected sources
   */
  private _resultsConnectionSourceData: DynamicProperty<string>[] = [];
  private _verticalsConnectionSourceData: DynamicProperty<ISearchVerticalSourceData>;

  private _propertyPaneSearchResultsFields: IPropertyPaneField<IPropertyFieldMultiSelectProps>[] = [];
  private _propertyPaneSearchVerticalsFields: IPropertyPaneField<unknown>[];

  private verticalsConfiguration: IDataVerticalConfiguration[];

  /**
   * The available layout definitions (not instanciated)
   */
  protected availableLayoutDefinitions: ILayoutDefinition[] = AvailableLayouts.BuiltinLayouts.filter(layout => { return layout.type === LayoutType.Filters; });

  //#endregion

  //#region Class methods

    //#region Dynamic data methods
  public getPropertyDefinitions(): IDynamicDataPropertyDefinition[] {

    const propertyDefinitions: IDynamicDataPropertyDefinition[] = [];

    propertyDefinitions.push(
        {
            id: ComponentType.SearchFilters,
            title: this.properties.title ? `${this.properties.title} - ${this.instanceId}` : `${webPartStrings.General.WebPartDefaultTitle} - ${this.instanceId}`,
        }
    );

    return propertyDefinitions;
  }

  public getPropertyValue(propertyId: string): string {
    return;
  }

  /**
   * Make sure the dynamic properties are correctly connected to the corresponding sources according to the proeprty pane settings
  */
  private ensureDynamicDataSourcesConnection(): void {

    // First, unregister the properties every time. Simpler than updated existing ones.
    this._resultsConnectionSourceData.forEach(dynamicProperty => {
        dynamicProperty.unregister(this.render);
    });

    // Then reset the dynamic properties to an empty array to start connections over.
    this._resultsConnectionSourceData = [];

    // Search Results Web Part data sources
    if (this.properties.searchResultsDataSourceReferences.length > 0) {

        this.properties.searchResultsDataSourceReferences.forEach(reference => {

            const dataSourceDynamicProperty = new DynamicProperty<string>(this.context.dynamicDataProvider);

            // Register the data source manually since we don't want user select properties manually via native property pane controls
            dataSourceDynamicProperty.setReference(reference);
            dataSourceDynamicProperty.register(this.render);

            this._resultsConnectionSourceData.push(dataSourceDynamicProperty);
        });
    }

    // Verticals WebPart data source
    if (this.properties.verticalsDataSourceReference) {
              
        if (!this._verticalsConnectionSourceData) {
            this._verticalsConnectionSourceData = new DynamicProperty<ISearchVerticalSourceData>(this.context.dynamicDataProvider);
        }

        this._verticalsConnectionSourceData.setReference(this.properties.verticalsDataSourceReference);
        this._verticalsConnectionSourceData.register(this.render);
        
    } else {

        if (this._verticalsConnectionSourceData) {
            this._verticalsConnectionSourceData.unregister(this.render);
        }
    }

  }

  protected async onInit(): Promise<void> {

    this.initializeProperties();

    await super.onInit();
    
    this.context.dynamicDataSourceManager.initializeSource(this);

    this.ensureDynamicDataSourcesConnection();

    return;
  }

    //#endregion

    //#region WebPart lifecycle methods

    protected get isRenderAsync(): boolean {
        return true;
    }

    public async render(): Promise<void> {

      await super.initTemplate();

      return this.renderCompleted();        
    }
  
  public renderCompleted(): void {
    
    let renderRootElement: JSX.Element;

    if (this.properties.filtersConfiguration.length > 0) {

       const element: React.ReactElement<ISearchFiltersProps> = React.createElement(
        SearchFilters,
        {
          id: this.getComponentId(ComponentType.SearchFilters),
          filtersConfiguration: this.properties.filtersConfiguration,
          searchResultsComponentIds: this.properties.searchResultsDataSourceReferences,
          searchVerticalsComponentId: this.properties.verticalsDataSourceReference,
          operator: this.properties.filterOperator,
          enableDebugMode: this.properties.enableDebugMode,
          useMicrosoftGraphToolkit: this.properties.useMicrosoftGraphToolkit,
          templateContent: this.templateContentToDisplay,
          theme: this._themeVariant.isInverted ? "dark" : ""
        }
      );

      renderRootElement = element;

    } else {

      if (this.displayMode === DisplayMode.Edit) {

        const placeholder: React.ReactElement<IPlaceholderProps> = React.createElement(
            this._placeholderComponent,
            {
                iconName: "",
                iconText: webPartStrings.General.PlaceHolder.IconText,
                description: () => React.createElement(PlaceHolder, { description: webPartStrings.General.PlaceHolder.Description } , null),
                buttonLabel: webPartStrings.General.PlaceHolder.ConfigureBtnLabel,
                onConfigure: () => { this.context.propertyPane.open(); }
            }
        );
  
        renderRootElement = placeholder;
     }
    }

    ReactDom.render(renderRootElement, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  private initializeProperties(): void {

    if (!this.properties.filtersConfiguration) {
      this.properties.filtersConfiguration = [
        {
          "filterName":"FileType",
          "displayName":{
             "fr-fr":"Type de fichier",
             "default":"File Type"
          },
          "template": BuiltinFilterTemplates.CheckBox,
          "showCount":true,
          "operator": FilterConditionOperator.AND,
          "isMulti": false,
          "sortBy": FilterSortType.ByCount,
          "sortDirection":FilterSortDirection.Descending,
          "maxBuckets":10000,
          "sortIdx":12,
          "aggregations": [
            {
               "aggregationName": {
                  "fr-fr":"Document Word",
                  "default":"Word document"
               },
               "matchingValues":[
                  "docx",
                  "doc",
                  "docm"
               ],
               "aggregationValue":"or(\"docx\",\"doc\",\"docm\")",
               "aggregationValueIconUrl":"http://localhost:8080/assets/icons/word.svg"
            }
          ]
        }
      ];
    }

    this.properties.filterOperator = this.properties.filterOperator ? this.properties.filterOperator : FilterConditionOperator.OR;
    this.properties.searchResultsDataSourceReferences = this.properties.searchResultsDataSourceReferences ? this.properties.searchResultsDataSourceReferences : [];
  
    this.properties.selectedLayoutKey = this.properties.selectedLayoutKey ? this.properties.selectedLayoutKey : BuiltinLayoutsKeys.FiltersDefault;
  }

    //#endregion

    //#region Property Pane methods

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: "General",
              groupFields: [
                ...this._propertyPaneSearchResultsFields,
                PropertyPaneChoiceGroup('filterOperator',{
                  label: webPartStrings.PropertyPane.CommonSettings.FilterOperatorLabel,
                  options: [
                    {
                      key: FilterConditionOperator.AND,
                      text: webPartStrings.PropertyPane.CommonSettings.ANDOperator
                    },
                    {
                      key: FilterConditionOperator.OR,
                      text: webPartStrings.PropertyPane.CommonSettings.OROperator
                    }
                  ]
                }),
                ...this._propertyPaneSearchVerticalsFields
              ]
            },
            {
              groupName: "Filter settings",
              isCollapsed: false,
              groupFields: [
                new PropertyPaneFiltersConfiguration('filtersConfiguration', {
                  serviceScope: this.context.serviceScope,
                  defaultValue: this.properties.filtersConfiguration,
                  verticalsConfiguration: this.verticalsConfiguration
                })
              ]
            }
          ],
          displayGroupsAsAccordion: true
        },
        // Templating page
        {
          displayGroupsAsAccordion: true,
          groups: [this.getTemplateOptionsGroup()]

        },
        // Common page
        {
          displayGroupsAsAccordion: true,
          groups: [this.getThemePageGroup()]
        },
         // 'About' infos
        {
          displayGroupsAsAccordion: true,
          groups: [
              ...this.getPropertyPaneWebPartInfoGroups(),
          ]
        }
      ]
    };
  }

  public override async onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): Promise<void> {
    
    if (propertyPath.localeCompare("verticalsDataSourceReference") === 0 || 
      propertyPath.localeCompare("searchResultsDataSourceReferences") === 0)  {
      this.ensureDynamicDataSourcesConnection();
    }

    if (propertyPath.localeCompare('useVerticals') === 0) {
      if (!this.properties.useVerticals) {
          this.properties.verticalsDataSourceReference = undefined;
          this._verticalsConnectionSourceData = undefined;
          this.verticalsConfiguration = undefined;

          // Reset vertical keys for all filters
          this.properties.filtersConfiguration = this.properties.filtersConfiguration.map(f => {
            f.verticalKeys = [];
            return f;
          });
      }
    }

    this._propertyPaneSearchResultsFields = await this.getSearchResultsConnectionField();
    this._propertyPaneSearchVerticalsFields = await this.getVerticalsConnectionField();
    this.context.propertyPane.refresh();

    await super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected async onPropertyPaneConfigurationStart(): Promise<void> {
    await this.loadPropertyPaneResources();
  }

  protected async loadPropertyPaneResources(): Promise<void> {
    this._propertyPaneSearchResultsFields = await this.getSearchResultsConnectionField();
    this._propertyPaneSearchVerticalsFields = await this.getVerticalsConnectionField();

    await super.loadPropertyPaneResources();
  }

  private async getSearchResultsConnectionField(): Promise<IPropertyPaneField<IPropertyFieldMultiSelectProps>[]> {

    const availableSources = await this.dynamicDataService.getAvailableDataSourcesByType(ComponentType.SearchResults);
    
    const sourceOptions = availableSources.map(source => {
        return {
            text: source.text,
            key: source.key,
        } as IComboBoxOption;
    });

    this.properties.searchResultsDataSourceReferences.map(ref => {
      const existingSource = sourceOptions.filter(s =>s.key === ref)[0];
      if (!existingSource) {
        sourceOptions.push( {
          key: ref,
          text: `(Not available) ${ref}`
        });
      }
    });

    return [
        PropertyFieldMultiSelect('searchResultsDataSourceReferences', {
            key: "searchResultsDataSourceReferences",
            label: webPartStrings.PropertyPane.CommonSettings.UseSearchResultsWebPartLabel,
            options: sourceOptions,
            selectedKeys: this.properties.searchResultsDataSourceReferences
        })
    ];
  }

  private async getVerticalsConnectionField(): Promise<IPropertyPaneField<unknown>[]> {

    const verticalFields = [
        PropertyPaneToggle('useVerticals', {
            label: "Use verticals",
            checked: this.properties.useVerticals
        }),
    ];

    if (this.properties.useVerticals) {
        verticalFields.push(
            PropertyPaneDropdown('verticalsDataSourceReference', {
                options: await this.dynamicDataService.getAvailableDataSourcesByType(ComponentType.SearchVerticals),
                label: "Search verticals component to connect to"
            })
        );
    }

    if (this.properties.verticalsDataSourceReference && this._verticalsConnectionSourceData) {

      const { verticalsConfiguration } = this._verticalsConnectionSourceData.tryGetValue();
      this.verticalsConfiguration = verticalsConfiguration;
     
  }
    
    return verticalFields;
  }

    //#endregion

  //#endregion
}
