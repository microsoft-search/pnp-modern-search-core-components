//#region Imports
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode, ServiceKey } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration, 
  IPropertyPaneField, 
  IPropertyPaneGroup, 
  PropertyPaneDropdown, 
  PropertyPaneToggle} from '@microsoft/sp-property-pane';
import * as webPartStrings from 'SearchResultsWebPartStrings';
import SearchResults from './components/SearchResults';
import { BaseWebPart } from '../../common/BaseWebPart';
import { ISearchResultsWebPartProps } from './ISearchResultsWebPartProps';
import { IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';
import { ComponentType } from '../../common/ComponentType';
import IDataSource from '../../models/common/IDataSource';
import { ServiceScopeHelper } from '../../helpers/ServiceScopeHelper';
import { SharePointTokenService } from '../../services/tokenService/SharePointTokenService';
import { ISharePointTokenService } from '../../services/tokenService/ISharePointTokenService';
import PlaceHolder from '../../controls/WebPartPlaceholder/WebPartPlaceholder';
import { IPlaceholderProps } from '@pnp/spfx-controls-react';
import { DynamicProperty } from '@microsoft/sp-component-base';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { LayoutHelper } from '../../helpers/LayoutHelper';
import { ILayoutDefinition, LayoutType } from '../../models/common/ILayoutDefinition';
import { AvailableLayouts, BuiltinLayoutsKeys } from '../../layouts/AvailableLayouts';
import { ITemplateContext } from '../../models/common/ITemplateContext';
import { ISearchVerticalSourceData } from '../../models/dynamicData/ISearchVerticalSourceData';
import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls';
import { LocalizedStringHelper } from '@pnp/modern-search-core/dist/es6/helpers/LocalizedStringHelper';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { DynamicPropertyHelper } from '../../helpers/DynamicPropertyHelper';
import { EntityType } from '@pnp/modern-search-core/dist/es6/models/search/IMicrosoftSearchRequest';

//#endregion

export default class SearchResultsWebPart extends BaseWebPart<ISearchResultsWebPartProps> {

    //#region Class attributes

        //#region Services


        /**
         * The SharePoint token service instance
         */
        private sharePointTokenService: ISharePointTokenService;

        //#endregion

        //#region Source fields

        /**
         * The Microsoft Search source for the WebPart
         */
        private microsoftSearchDataSource: IDataSource;

        private availableFields: string[] = [];

        //#endregion

        //#region Layout fields

        /**
         * The available layout definitions (not instanciated)
         */
        protected availableLayoutDefinitions: ILayoutDefinition[] = AvailableLayouts.BuiltinLayouts.filter(layout => { return layout.type === LayoutType.Results; });

        //#endregion

        //#region Connection fields
 
        /**
         * Dynamic data related fields
         */
        private _filtersConnectionSourceData: DynamicProperty<string>;
        private _verticalsConnectionSourceData: DynamicProperty<ISearchVerticalSourceData>;

        //#endregion

        //#region Property pane fields
        private propertyPaneFiltersConnectionField: IPropertyPaneField<unknown>[];

        //#endregion

        //#region Misc fields

    /**
     * Querty template 
     */
    private _resolvedQueryTemplate: string;

    //#endregion

    //#endregion

    //#region Class methods

        //#region WebPart lifecycle methods

    protected get isRenderAsync(): boolean {
        return true;
    }

    protected async onInit(): Promise<void> {

        this.inializeProperties();

        await super.onInit();

        this.initializeWebPartServices();

        await this.loadResources();

        // Initialize data source instance
        if (!this.microsoftSearchDataSource) {
            this.microsoftSearchDataSource = await this.getMicrosoftSearchSourceInstance();
        }

        this.context.dynamicDataSourceManager.initializeSource(this);

        this.ensureDynamicDataSourcesConnection();       
    }

    public async render(): Promise<void> {

        await this.initTemplate();

        // Refresh the token values with the latest information from environment (i.e connections and settings)
        this._resolvedQueryTemplate = await this.sharePointTokenService.resolveTokens(this.properties.queryTemplate);

        return this.renderCompleted();        
    }

    protected renderCompleted(): void {

        let renderRootElement: JSX.Element;
        let renderElement: React.ReactElement = null;

        if (this.isValidSearchQuery()) {
            
            // The component needs to be always rendered even if not selected on current vertical
            // This is required to keep proper lifecycle of underlying web component properties 
            const renderSearchResults = 
                <SearchResults
                    id={this.getComponentId(ComponentType.SearchResults)}
                    entityTypes={this.properties.entityTypes}
                    searchInputComponentId={this.getSearchBoxComponentId()}
                    searchFiltersComponentId={this.properties.filtersDataSourceReference}
                    searchVerticalsComponentId={this.properties.verticalsDataSourceReference}
                    selectedVerticalKeys={this.properties.selectedVerticalKeys}
                    defaultQueryText={this.getQueryTextValue()}
                    queryTemplate={this._resolvedQueryTemplate}
                    useBetaEndpoint={ this.properties.useBetaEndpoint}
                    selectedFields={ this.properties.selectedFields}
                    enableDebugMode={ this.properties.enableDebugMode}
                    showCount={ this.properties.showResultsCount}
                    enableResultTypes={ this.properties.enableResultTypes}
                    enableModification={ this.properties.queryAlterationOptions.enableModification}
                    enableSuggestion={ this.properties.queryAlterationOptions.enableSuggestion}
                    connectionIds={ this.properties.contentSources}
                    sortFieldsConfiguration={ this.properties.sortFieldsConfiguration}
                    numberOfPagesToDisplay={ this.properties.paging.numberOfPagesToDisplay}
                    pageSize={ this.properties.paging.pageSize}
                    showPaging={ this.properties.paging.showPaging}
                    currentUICultureName={ this.context.pageContext.cultureInfo.currentUICultureName}
                    templateContent={ this.templateContentToDisplay}
                    templateContext={ this.getTemplateContext()}
                    theme={ this._themeVariant.isInverted ? "dark" : ""}
                    templateSlots={ this.properties.layoutProperties.slots}
                    onResultsFetched={ (data) => {
                        this.availableFields = data.availableFields;
                        this.context.propertyPane.refresh();
                    }}
                />

            if (!this.shouldRenderComponent() && this.displayMode === DisplayMode.Edit) {
                renderElement = <>
                                    {renderSearchResults}
                                    <MessageBar messageBarType={MessageBarType.warning}>Current vertical is not part of configured vertical for that WebPart</MessageBar>
                                </>
            } else {
                renderElement = renderSearchResults;
            }

            renderRootElement = renderElement;
    
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

        super.renderCompleted();
    }

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    //#endregion

        //#region Dynamic data methods

    public getPropertyDefinitions(): IDynamicDataPropertyDefinition[] {

        // Use the Web Part title as property title since we don't expose sub properties
        const propertyDefinitions: IDynamicDataPropertyDefinition[] = [];

        propertyDefinitions.push(
            {
                id: ComponentType.SearchResults,
                title: this.properties.title ? `${this.properties.title} - ${this.instanceId}` : `${webPartStrings.General.WebPartDefaultTitle} - ${this.instanceId}`,
            }
        );

        return propertyDefinitions;
    }

    public getPropertyValue(propertyId: string): string {
        return;
    }

    //#endregion

        //#region Property Pane methods

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
          pages: [
            // Query configuration page
            {
              groups: [
                  ...this.microsoftSearchDataSource.getPropertyPaneGroupsConfiguration(),
              ],
              displayGroupsAsAccordion: true
            },
            // Templating page
            {
                displayGroupsAsAccordion: true,
                groups: this.getStylingPageGroups()
            },
            // Common page
            {
                displayGroupsAsAccordion: true,
                groups: [this.getThemePageGroup()]
            }
          ]
        };
    }

    protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): Promise<void> {

        //#region Source related properties

        if (this.microsoftSearchDataSource) {

            this.microsoftSearchDataSource.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
        
            // Bind connected data sources
            if (propertyPath.localeCompare('filtersDataSourceReference') === 0 && this.properties.filtersDataSourceReference ||
                propertyPath.localeCompare('verticalsDataSourceReference') === 0 && this.properties.verticalsDataSourceReference
            ) {
                this.ensureDynamicDataSourcesConnection();
                this.context.propertyPane.refresh();
            }
        
            if (propertyPath.localeCompare('useFilters') === 0) {
                if (!this.properties.useFilters) {
                    this.properties.filtersDataSourceReference = undefined;
                    this._filtersConnectionSourceData = undefined;
                    this.context.dynamicDataSourceManager.notifyPropertyChanged(ComponentType.SearchResults);
                }
            }

            if (propertyPath.localeCompare('useVerticals') === 0) {
                if (!this.properties.useVerticals) {
                    this.properties.verticalsDataSourceReference = undefined;
                    this.properties.selectedVerticalKeys = [];
                    this._verticalsConnectionSourceData = undefined;
                }
            }
        }

        //#endregion

        this.propertyPaneFiltersConnectionField = await this.getVerticalsConnectionField();

        this.context.propertyPane.refresh();

        await super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

        //#endregion
    }

    /**
     * Returns layout template options if any
     */
    private getLayoutTemplateOptions(): IPropertyPaneField<unknown>[] {

        if (this.layout) {
            return this.layout.getPropertyPaneFieldsConfiguration(this.availableFields);
        } else {
            return [];
        }
    }

    private async getVerticalsConnectionField(): Promise<IPropertyPaneField<unknown>[]> {

        const verticalFields = [
            PropertyPaneToggle('useVerticals', {
                label: webPartStrings.PropertyPane.LayoutPage.UseSearchVerticalsField,
                checked: this.properties.useVerticals
            }),
        ];

        if (this.properties.useVerticals) {
            verticalFields.push(
                PropertyPaneDropdown('verticalsDataSourceReference', {
                    options: await this.dynamicDataService.getAvailableDataSourcesByType(ComponentType.SearchVerticals),
                    label: webPartStrings.PropertyPane.LayoutPage.SearchVerticalsConnectToComponentField
                })
            );
        }

        if (this.properties.verticalsDataSourceReference && this._verticalsConnectionSourceData) {

            const { verticalsConfiguration } = this._verticalsConnectionSourceData.tryGetValue();

            verticalFields.push(
                PropertyFieldMultiSelect('selectedVerticalKeys', {
                    key: "selectedVerticalKeys",
                    label: webPartStrings.PropertyPane.LayoutPage.SearchVerticalsConnectionField,
                    options: verticalsConfiguration.map(v => { return { key: v.key,text: LocalizedStringHelper.getDefaultValue(v.tabName)}}),
                    selectedKeys: this.properties.selectedVerticalKeys
                })
            )
        }
        
        return verticalFields;
    }

    /**
     * Returns property pane 'Styling' page groups
     */
    private getStylingPageGroups(): IPropertyPaneGroup[] {

        const groups: IPropertyPaneGroup[] = [
            this.getTemplateOptionsGroup(),
            {
                groupName: webPartStrings.PropertyPane.LayoutPage.CommonLayoutOptionsGroupName,
                groupFields: [
                    ...LayoutHelper.getCommonLayoutsOptionFields(this.properties),
                    ...this.propertyPaneFiltersConnectionField
                ]
            }
        ];

        // Add template options if any
        const layoutOptions = this.getLayoutTemplateOptions();
        if (layoutOptions.length > 0) {
            groups.push({
                groupName: webPartStrings.PropertyPane.LayoutPage.LayoutTemplateOptionsGroupName,
                groupFields: layoutOptions
            });
        }

        return groups;
    }

    //#endregion

        //#region Utility methods

    private initializeWebPartServices(): void {

        this.context.serviceScope.whenFinished(() => {
            this.sharePointTokenService = this.context.serviceScope.consume<ISharePointTokenService>(SharePointTokenService.ServiceKey);
        });
    }

    private inializeProperties(): void {
        this.properties.selectedLayoutKey = this.properties.selectedLayoutKey ? this.properties.selectedLayoutKey : BuiltinLayoutsKeys.ResultsDefault;
    }

    protected async loadPropertyPaneResources(): Promise<void> {
        this.propertyPaneFiltersConnectionField = await this.getVerticalsConnectionField();
    }

    /**
     * Gets the data source instance according to the current selected one
     * @param dataSourceKey the selected data source provider key
     * @param dataSourceDefinitions the available source definitions
     * @returns the data source provider instance
     */
    private async getMicrosoftSearchSourceInstance(): Promise<IDataSource> {

        let dataSource: IDataSource = undefined;
        let serviceKey: ServiceKey<IDataSource> = undefined;

        // eslint-disable-next-line no-case-declarations
        const { MicrosoftSearchDataSource } = await import(
            /* webpackChunkName: 'pnp-modern-search-core-microsoft-search-datasource' */
            '../../datasources/MicrosoftSearchDataSource'
        );

        serviceKey = ServiceKey.create<IDataSource>('ModernSearchCore:MicrosoftSearchDataSource', MicrosoftSearchDataSource);        
                    
        return new Promise<IDataSource>((resolve) => {

            // Register here services we want to expose to custom data source (ex: TokenService)
            // The instances are shared across all data sources. It means when properties will be set once for all consumers. Be careful manipulating these instance properties. 
            const childServiceScope = ServiceScopeHelper.registerChildServices(this.webPartInstanceServiceScope, [
                serviceKey
            ]);

            childServiceScope.whenFinished(async () => {

                // Register the data source service in the Web Part scope only (child scope of the current scope)
                dataSource = childServiceScope.consume<IDataSource>(serviceKey);

                // Initialize the data source with current Web Part properties
                if (dataSource) {

                    // Initializes Web part lifecycle methods and properties
                    dataSource.properties = this.properties;
                    dataSource.context = this.context;
                    dataSource.render = this.render;
                    
                    await dataSource.onInit();

                    resolve(dataSource);
                }
            });
        });
    }

    /**
     * Make sure the dynamic properties are correctly connected to the corresponding sources according to the proeprty pane settings
     */
    private ensureDynamicDataSourcesConnection(): void {

        // Filters Web Part data source
        if (this.properties.filtersDataSourceReference) {

            if (!this._filtersConnectionSourceData) {
                this._filtersConnectionSourceData = new DynamicProperty<string>(this.context.dynamicDataProvider);
            }

            this._filtersConnectionSourceData.setReference(this.properties.filtersDataSourceReference);
            this._filtersConnectionSourceData.register(this.render);

        } else {

            if (this._filtersConnectionSourceData) {
                this._filtersConnectionSourceData.unregister(this.render);
            }
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

    private getTemplateContext(): ITemplateContext {
        return {
            slots: LayoutHelper.convertTemplateSlotsToHashtable(this.properties.layoutProperties.slots)
        };
    }

    private isValidSearchQuery(): boolean {
        
       let hasValidEntityTypes = false;

        if (this.properties.entityTypes.length > 0) {
            if (this.properties.entityTypes.indexOf(EntityType.ExternalItem) !== -1 && this.properties.contentSources.length === 0) {
                hasValidEntityTypes = false;
            } else {
                hasValidEntityTypes= true;
            }
        }

        const canExecuteQuery =  !!this.microsoftSearchDataSource && 
                                (this.properties.queryText.reference || !this.properties.queryText.reference && !isEmpty(this.getQueryTextValue())) &&
                                hasValidEntityTypes;

        return canExecuteQuery;
    }

    /**
     * If connected to a search verticales, determines if the component should be displayed according to current selected vertical
     * @returns 'true' if it should render, 'false' otherwise
     */
    private shouldRenderComponent(): boolean {

        let shouldRender = true;
        if (this._verticalsConnectionSourceData) {

            const { selectedVerticalKey } = this._verticalsConnectionSourceData.tryGetValue();

            if (this.properties.selectedVerticalKeys.indexOf(selectedVerticalKey) === -1) {
                shouldRender = false
            }
        }

        return shouldRender; 
    }

    /**
     * Resolves the search b ox component id if connected
     * @returns the component ID
     */
    private getSearchBoxComponentId(): string {

        let searchBoxComponentId: string = undefined;

        // Because 'queryText' can have a value other than a SearchBox component (ex: search query from top bar), we need it to resolve if manually 
        if (this.properties.queryText.reference?.indexOf(ComponentType.SearchBox) !== -1) {
            searchBoxComponentId = this.properties.queryText.reference;
        }

        return searchBoxComponentId;
    }

    /**
     * Determines the input query text value based on dynamic data connections
     */
    private getQueryTextValue(): string {

        let inputQueryText: string = undefined;

        // tryGetValue() will resolve to '' if no Web Part is connected or if the connection is removed
        // The value can be also 'undefined' if the data source is not already loaded on the page.
        let inputQueryFromDataSource: string | undefined = "";
        if (this.properties.queryText.reference && this.properties.useDefaultQueryText) {
            try {
                inputQueryFromDataSource = DynamicPropertyHelper.tryGetValueSafe(this.properties.queryText);
                if (inputQueryFromDataSource !== undefined && typeof (inputQueryFromDataSource) === 'string') {
                    inputQueryFromDataSource = decodeURIComponent(inputQueryFromDataSource);
                }

            } catch (error) {
                // Likely issue when q=%25 in spfx
            }
        } else {
            inputQueryFromDataSource = DynamicPropertyHelper.tryGetValueSafe(this.properties.queryText);
        }

        if (!inputQueryFromDataSource) { // '' or 'undefined'

            if (this.properties.useDefaultQueryText) {
                inputQueryText = this.properties.defaultQueryText;
            } else if (inputQueryFromDataSource !== undefined) {
                inputQueryText = inputQueryFromDataSource;
            }

        } else if (typeof (inputQueryFromDataSource) === 'string') {
            inputQueryText = decodeURIComponent(inputQueryFromDataSource);
        }

        return inputQueryText;
    }

    //#endregion

    //#endregion
}