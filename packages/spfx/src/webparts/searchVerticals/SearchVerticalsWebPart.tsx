//#region Imports
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneConfiguration} from '@microsoft/sp-property-pane';
import * as webPartStrings from 'SearchVerticalsWebPartStrings';
import SearchVerticals from './components/SearchVerticals';
import { ISearchVerticalsProps } from './components/ISearchVerticalsProps';
import { ISearchVerticalsWebPartProps } from './ISearchVerticalsWebPartProps';
import { IDataVerticalConfiguration } from '@pnp/modern-search-core/dist/es6/models/common/IDataVerticalConfiguration';
import { PageOpenBehavior } from '@pnp/modern-search-core/dist/es6/helpers/UrlHelper';
import { ConfigurationFieldType, IConfigurationTabField } from '../../controls/ConfigurationPanel/IConfigurationTabField';
import { isEmpty, isEqual } from '@microsoft/sp-lodash-subset';
import { IChoiceGroupProps, ITextFieldProps, IToggleProps } from 'office-ui-fabric-react';
import { ConfigurationPanel } from '../../controls/ConfigurationPanel/ConfigurationPanel';
import { ItemRepeater } from '../../controls/ItemRepeater/ItemRepeater';
import { IConfigurationTab } from '../../controls/ConfigurationPanel/IConfigurationTab';
import { ILocalizedFieldProps } from '../../controls/LocalizedTextField/ILocalizedFieldProps';
import { BaseWebPart } from '../../common/BaseWebPart';
import { IDynamicDataCallables, IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';
import { ComponentType } from '../../common/ComponentType';
import { ISearchVerticalSourceData } from '../../models/dynamicData/ISearchVerticalSourceData';
import { DisplayMode } from '@microsoft/sp-core-library';
import { IPlaceholderProps } from '@pnp/spfx-controls-react';
import WebPartPlaceholder from '../../controls/WebPartPlaceholder/WebPartPlaceholder';
import { LocalizedStringHelper } from '@pnp/modern-search-core/dist/es6/helpers/LocalizedStringHelper';
import { PropertyPaneFormDataCollection } from '../../propertyPane/PropertyPaneFormDataCollection/PropertyPaneFormDataCollection';
import { ILayoutDefinition, LayoutType } from '../../models/common/ILayoutDefinition';
import { AvailableLayouts, BuiltinLayoutsKeys } from '../../layouts/AvailableLayouts';
//#endregion

const getErrorMessage = (value: string): string => {
  return !isEmpty(value) ? '' : `Field must have a value`;
};

export default class SearchVerticalsWebPart extends BaseWebPart<ISearchVerticalsWebPartProps> implements IDynamicDataCallables {
  
  /**
   * The available layout definitions (not instanciated)
   */
  protected availableLayoutDefinitions: ILayoutDefinition[] = AvailableLayouts.BuiltinLayouts.filter(layout => { return layout.type === LayoutType.Verticals; });

  //#region Class attributes

  private _itemRepeaterRef = React.createRef<ItemRepeater<IDataVerticalConfiguration>>();
  private _lastCreatedConfigurationPanelRef: React.RefObject<ConfigurationPanel<IDataVerticalConfiguration>> = null;
  private _lastRowId: string;

  private currentSelectedVerticalKey: string;

  //#endregion

  //#region Class methods

    //#region Dynamic data methods

  public getPropertyDefinitions(): IDynamicDataPropertyDefinition[] {

    const propertyDefinitions: IDynamicDataPropertyDefinition[] = [];

    propertyDefinitions.push(
        {
            id: ComponentType.SearchVerticals,
            title: this.properties.title ? `${this.properties.title} - ${this.instanceId}` : `${webPartStrings.General.WebPartDefaultTitle} - ${this.instanceId}`,
        }
    );

    return propertyDefinitions;
  }

  public getPropertyValue(propertyId: string): ISearchVerticalSourceData {

    switch (propertyId) {
        case ComponentType.SearchVerticals:
            return {
                verticalsConfiguration: this.properties.verticalConfiguration,
                selectedVerticalKey: this.currentSelectedVerticalKey
            } as ISearchVerticalSourceData;
    }

    throw new Error('Bad property id');
  }

  //#endregion

    //#region WebPart lifecycle methods
    
    protected get isRenderAsync(): boolean {
      return true;
    } 

    /**
     * Initializes required Web Part properties
     */
    private initializeProperties(): void {
      this.properties.verticalConfiguration = this.properties.verticalConfiguration ? this.properties.verticalConfiguration : [];
      this.properties.selectedLayoutKey = this.properties.selectedLayoutKey ? this.properties.selectedLayoutKey : BuiltinLayoutsKeys.VerticalsDefault;
    }

    protected async onInit(): Promise<void> {

      await super.onInit();
      
      this.initializeProperties();

      this.context.dynamicDataSourceManager.initializeSource(this);
    }

    public async render(): Promise<void> {

      await super.initTemplate();

      return this.renderCompleted();        
    }

    public renderCompleted(): void {

      let renderRootElement: JSX.Element;
      
      if (this.properties.verticalConfiguration.length > 0) {

        const element: React.ReactElement<ISearchVerticalsProps> = React.createElement(
          SearchVerticals,
          {
            verticalConfiguration: this.properties.verticalConfiguration,
            id: this.getComponentId(ComponentType.SearchVerticals),
            theme: this._themeVariant.isInverted ? "dark" : "",
            templateContent: this.templateContentToDisplay,
            enableDebugMode: this.properties.enableDebugMode,
            useMicrosoftGraphToolkit: this.properties.useMicrosoftGraphToolkit,
            onVerticalSelected: (selectedVerticalKey) => {
              this.currentSelectedVerticalKey = selectedVerticalKey;
              this.context.dynamicDataSourceManager.notifySourceChanged();
            }
          } as ISearchVerticalsProps
        );

      renderRootElement = element;

    } else {

      if (this.displayMode === DisplayMode.Edit) {

        const placeholder: React.ReactElement<IPlaceholderProps> = React.createElement(
            this._placeholderComponent,
            {
              iconName: "",
              iconText: webPartStrings.General.PlaceHolder.IconText,
              description: () => React.createElement(WebPartPlaceholder, { 
               description: webPartStrings.General.PlaceHolder.Description,
               documentationLink: this.properties.documentationLink
             } , null),
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

    public override async onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): Promise<void> {
      await super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    }

  //#endregion

    //#region Property Pane methods

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

      const newVerticalConfiguration: IDataVerticalConfiguration = {
        isLink: false,
        key: "",
        linkUrl: "",
        openBehavior: PageOpenBehavior.NewTab,
        tabName: "",
        tabValue: ""
      };
  
      const verticalTabsConfiguration: IConfigurationTab[] = [
        {
          name: "General",
          fields: [
            {
              type: ConfigurationFieldType.LocalizedField,
              props: {
                  serviceScope: this.context.serviceScope,
                  label: webPartStrings.PropertyPane.VerticalConfigurationPane.VerticalName,
                  onGetErrorMessage: getErrorMessage,
                  required: true,
              } as Partial<ILocalizedFieldProps>,
              targetProperty: "tabName" 
            },
            {
              type: ConfigurationFieldType.TextField,
              props: {
                  label: webPartStrings.PropertyPane.VerticalConfigurationPane.VerticalKey,
                  required: true,
                  onGetErrorMessage: getErrorMessage,
              } as Partial<ITextFieldProps>,
              targetProperty: "key" 
          },
            {
              type: ConfigurationFieldType.TextField,
              props: {
                  label: webPartStrings.PropertyPane.VerticalConfigurationPane.VerticalValue,
              } as Partial<ITextFieldProps>,
              targetProperty: "tabValue",
            },
            {
              type: ConfigurationFieldType.Toggle,
              props: {
                  label: webPartStrings.PropertyPane.VerticalConfigurationPane.IsLink,
              } as Partial<IToggleProps>,
              targetProperty: "isLink"
            },
            {
              type: ConfigurationFieldType.TextField,
              props: {
                  label: webPartStrings.PropertyPane.VerticalConfigurationPane.LinkUrl,
              } as Partial<ITextFieldProps>,
              targetProperty: "linkUrl",
              isVisible: (dataObject: IDataVerticalConfiguration) => {
                return dataObject.isLink;
              }
            },
            {
              type: ConfigurationFieldType.ChoiceGroup,
              props: {
                  label: webPartStrings.PropertyPane.VerticalConfigurationPane.OpenBehavior,
                  options: [
                    {key: PageOpenBehavior.NewTab, text: webPartStrings.PropertyPane.VerticalConfigurationPane.NewTabOption},
                    {key: PageOpenBehavior.Self, text: webPartStrings.PropertyPane.VerticalConfigurationPane.SelfTabOption,}]
              } as Partial<IChoiceGroupProps>,
              isVisible: (dataObject: IDataVerticalConfiguration) => {
                return dataObject.isLink;
              },
              targetProperty: "openBehavior" 
            }
          ]
      },
      ];
  
      const mainFormFields: IConfigurationTabField[] = [
        {
            type: ConfigurationFieldType.Custom,
            targetProperty: null,
            onCustomRender: (field, defaultValue, onUpdate) => {
  
                this._lastCreatedConfigurationPanelRef = React.createRef<ConfigurationPanel<IDataVerticalConfiguration>>();
  
                return  <ConfigurationPanel<IDataVerticalConfiguration>
                            ref={this._lastCreatedConfigurationPanelRef}
                            configurationTabs={verticalTabsConfiguration}
                            renderRowTitle={(vertical: IDataVerticalConfiguration) => { return LocalizedStringHelper.getDefaultValue(vertical.tabName) }}
                            onFormSave={(formData) => { onUpdate(field, formData)}}
                            dataObject={defaultValue}
                            renderPanelTitle={() => webPartStrings.PropertyPane.VerticalConfigurationPane.Title}
                            onFormDismissed={(configuration: IDataVerticalConfiguration) => {
                                if (isEqual(configuration, newVerticalConfiguration)) {
                                    // Remove row as no item has been saved
                                    this._itemRepeaterRef.current.deleteItemRow(this._lastRowId)
                                }
                            }}
                        />;
            }
        }
      ];
  
      return {
        pages: [
          {
            groups: [
              {
                groupName: webPartStrings.PropertyPane.SettingsPage.VerticalSettingsGroupName,
                groupFields: [
                  new PropertyPaneFormDataCollection<IDataVerticalConfiguration>('verticalConfiguration', {
                    label: webPartStrings.PropertyPane.VerticalConfigurationPane.VerticalsLabel,
                    itemRepeaterProps: {
                        innerRef: this._itemRepeaterRef,
                        addButtonLabel:  webPartStrings.PropertyPane.VerticalConfigurationPane.Title,    
                        enableDragDrop: true
                    },
                    items: this.properties.verticalConfiguration,
                    newRowDefaultObject: () => newVerticalConfiguration,
                    formConfiguration: mainFormFields,
                    onRowAdded: (rowId: string) => {
                        // Save the row id to be able to delete it afterwards
                        this._lastRowId = rowId;
                        // Get the last created row (empty at this point) and open the panel
                        this._lastCreatedConfigurationPanelRef.current.togglePanel();
                    },
                    onRowsOrderChanged: (value: IDataVerticalConfiguration[]) => {                        
                        this.properties.verticalConfiguration = value;
                        this.renderCompleted()
                    }
                  })
                ]
              }
            ]
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

  //#endregion

  //#endregion
}
