import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IBaseWebPartProps } from "../models/common/IBaseWebPartProps";
import { ThemeProvider, IReadonlyTheme, ThemeChangedEventArgs } from '@microsoft/sp-component-base';
import { isEqual } from '@microsoft/sp-lodash-subset';
import { IPropertyPaneGroup, PropertyPaneLabel, PropertyPaneLink, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as commonStrings from "CommonStrings";
import { 
  SearchFiltersComponent, 
  SearchInputComponent, 
  SearchResultsComponent, 
  SearchVerticalsComponent,
  LanguageProvider,
  Providers,
  SharePointProvider,
  LocalizationHelper,
  AdaptiveCardComponent,
  VideoPlayerComponent
} from '@pnp/modern-search-core';
import {
  IPropertyPaneField, 
  PropertyPaneChoiceGroup, 
} from '@microsoft/sp-property-pane';
import { DisplayMode, Log, ServiceScope } from '@microsoft/sp-core-library';
import { ILocalizationService } from '../services/localizationService/ILocalizationService';
import { LocalizationService } from '../services/localizationService/LocalizationService';
import PnPTelemetry from '@pnp/telemetry-js';
import { ComponentType } from './ComponentType';
import { ComponentElements, ThemePublicCSSVariables } from '@pnp/modern-search-core/dist/es6/common/Constants';
import { ConfigurationFieldType, IConfigurationTabField } from '../controls/ConfigurationPanel/IConfigurationTabField';
import { IConfigurationTab } from '../controls/ConfigurationPanel/IConfigurationTab';
import { ColorPicker, IColor, getColorFromString } from '@fluentui/react';
import * as React from 'react';
import { ICustomColorField } from '../models/common/ICustomPalette';
import { ConfigurationPanel } from '../controls/ConfigurationPanel/ConfigurationPanel';
import { PropertyPaneFormDataCollection } from '../propertyPane/PropertyPaneFormDataCollection/PropertyPaneFormDataCollection';
import { ItemRepeater } from '../controls/ItemRepeater/ItemRepeater';
import { PropertyPaneFilePicker } from '../propertyPane/PropertyPaneFilePicker/PropertyPaneFilePicker';
import { LayoutHelper } from '../helpers/LayoutHelper';
import { BuiltinLayoutsKeys } from '../layouts/AvailableLayouts';
import { PropertyPaneCodeEditor } from '../propertyPane/PropertyPaneCodeEditor/PropertyPaneCodeEditor';
import { ILayoutDefinition, LayoutType } from '../models/common/ILayoutDefinition';
import { FileService } from '../services/fileService/FileService';
import { ILayout } from '../models/common/ILayout';
import IDynamicDataService from '../services/dynamicDataService/IDynamicDataService';
import { DynamicDataService } from '../services/dynamicDataService/DynamicDataService';
import IFileService from '../services/fileService/IFileService';
import '../styles/dist/tailwind.css';
import { PropertyPaneWebPartInformation } from '@pnp/spfx-property-controls';

//#region Default colors

const defaultLightColorOverrides = [
  {
    colorName: commonStrings.PropertyPane.PrimaryColorFieldName,
    colorValue: "",
    colorVariable: ThemePublicCSSVariables.colorPrimary
  },
  {
    colorName: commonStrings.PropertyPane.BackgroundColorFieldName,
    colorValue: "",
    colorVariable: ThemePublicCSSVariables.primaryBackgroundColor
  },
  {
    colorName: commonStrings.PropertyPane.TextColorFieldName,
    colorValue: "",
    colorVariable: ThemePublicCSSVariables.textColor
  }
];

const defaultDarkColorOverrides = [
  {
    colorName: commonStrings.PropertyPane.PrimaryColorFieldName,
    colorValue: "",
    colorVariable: ThemePublicCSSVariables.colorPrimary
  },
  {
    colorName: commonStrings.PropertyPane.BackgroundColorFieldName,
    colorValue: "",
    colorVariable: ThemePublicCSSVariables.primaryBackgroundColorDark
  },
  {
    colorName: commonStrings.PropertyPane.TextColorFieldName,
    colorValue: "",
    colorVariable: ThemePublicCSSVariables.textColorDark
  }
];

//#endregion

/**
 * Generic abstract class for all Web Parts in the solution
 */
export abstract class BaseWebPart<T extends IBaseWebPartProps> extends BaseClientSideWebPart<IBaseWebPartProps> {

    /**
     * Theme variables
     */
    protected _themeProvider: ThemeProvider;
    protected _themeVariant: IReadonlyTheme;

    /**
     * Placeholder component loaded dynamically
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected _placeholderComponent: any = null;

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected _propertyPanePropertyEditor: any = null;

    /**
     * The Web Part properties
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: redefinition
    protected properties: T;

    private languageProvider: LanguageProvider;

    private _colorsItemRepeaterRef = React.createRef<ItemRepeater<ICustomColorField>>();

    private _domPurify: DOMPurify.DOMPurifyI;

    /**
     * All availabel layout for the current WebPart
     */
    protected abstract availableLayoutDefinitions: ILayoutDefinition[];

    /**
     * The template content to display
     */
    protected templateContentToDisplay: string;

    /**
     * External template content already fetched
     */
    protected externalTemplateContent: string;

    /**
     * The file service for external templates
     */
    protected fileService: FileService;

    /**
     * The dynamic data service instance
     */
    protected dynamicDataService: IDynamicDataService;

    /**
     * The service scope for this specific Web Part instance
     */
    protected webPartInstanceServiceScope: ServiceScope;

    /**
     * The selected layout instance for the Web Part
     */
    protected layout: ILayout;

    constructor() {
        super();

        this.languageProvider = new LanguageProvider();
    } 

    protected async onInit(): Promise<void> {

      try {
          // Disable PnP Telemetry
          const telemetry = PnPTelemetry.getInstance();
          telemetry.optOut();
      } catch (error) {
          Log.warn(this.manifest.alias, `Opt out for PnP Telemetry failed. Details: ${error}`, this.context.serviceScope);
      }

      const localizationService = this.context.serviceScope.consume<ILocalizationService>(LocalizationService.ServiceKey);
      const currentLocale = await localizationService.getCurrentPageUILanguage();

      // Define all needed components
      if (!customElements.get(ComponentElements.SearchResultsComponent)) {
        customElements.define([ComponentElements.SearchResultsComponent].toString(), SearchResultsComponent);
      }
  
      if (!customElements.get(ComponentElements.SearchFiltersComponent)) {
        customElements.define([ComponentElements.SearchFiltersComponent].toString(), SearchFiltersComponent);
      }
  
      if (!customElements.get(ComponentElements.SearchInputComponent)) {
        customElements.define([ComponentElements.SearchInputComponent].toString(), SearchInputComponent);
      }
  
      if (!customElements.get(ComponentElements.SearchVerticalsComponent)) {
        customElements.define([ComponentElements.SearchVerticalsComponent].toString(), SearchVerticalsComponent);
      }

      if (!customElements.get(ComponentElements.AdaptiveCardComponent)) {
        customElements.define([ComponentElements.AdaptiveCardComponent].toString(), AdaptiveCardComponent);
      }

      if (!customElements.get(ComponentElements.VideoPlayerComponent)) {
        customElements.define([ComponentElements.VideoPlayerComponent].toString(), VideoPlayerComponent);
      }
    
      if (!Providers.globalProvider) {
          Providers.globalProvider = new SharePointProvider(this.context);
      }

      // Set current language according to cuirrent page translation language or UI locale if not translated
      if (LocalizationHelper.strings?.language !== currentLocale) {
        await this.languageProvider.setLanguage(currentLocale);
      }

      // Initializes shared services
      await this.initializeBaseWebPart();

      // Initialize layout instance
      if (!this.layout) {
          this.layout = await LayoutHelper.getLayoutInstance(this.webPartInstanceServiceScope, this.context, this.properties, this.properties.selectedLayoutKey, this.availableLayoutDefinitions);
      }

      await this.loadResources();
      
      return;
    }
    
    /**
     * Initializes shared services and properties used by all Web Parts
     */
    protected async initializeBaseWebPart(): Promise<void> {

      // Initialize services

      this.context.serviceScope.whenFinished(() => {
        this.dynamicDataService = this.context.serviceScope.consume<IDynamicDataService>(DynamicDataService.ServiceKey);
        this.dynamicDataService.dynamicDataProvider = this.context.dynamicDataProvider;
        this.fileService = this.context.serviceScope.consume<IFileService>(FileService.ServiceKey);
      });

      // Create a specific Web Part service scope
      this.webPartInstanceServiceScope = this.context.serviceScope.startNewChild();
      this.webPartInstanceServiceScope.finish();

      // Initializes theme variant
      this.initThemeVariant();

      this.properties.followSiteTheme = this.properties.followSiteTheme !== undefined ? this.properties.followSiteTheme : true;
      this.properties.colorOverrides = this.properties.colorOverrides ? this.properties.colorOverrides : (this._themeVariant.isInverted ? defaultDarkColorOverrides : defaultLightColorOverrides);
      this.properties.layoutProperties = this.properties.layoutProperties ? this.properties.layoutProperties : {};

      this.setThemeVariables();
    }

    protected async loadPropertyPaneResources(): Promise<void> {


      const { PropertyPanePropertyEditor } = await import(
          /* webpackChunkName: 'pnp-modern-search-property-pane' */
          '@pnp/spfx-property-controls/lib/PropertyPanePropertyEditor'
      );
      this._propertyPanePropertyEditor = PropertyPanePropertyEditor;
    }

    protected async onPropertyPaneConfigurationStart(): Promise<void> {
      await this.loadPropertyPaneResources();
    }

    /**
     * Returns common information groups for the property pane
     */
    protected getPropertyPaneWebPartInfoGroups(): IPropertyPaneGroup[] {

      return [
          {
            groupName: commonStrings.PropertyPane.InformationPage.About,
            groupFields: [
              PropertyPaneWebPartInformation({
                description: `<div class="flex justify-between"><span>${commonStrings.PropertyPane.InformationPage.Authors}:<ul style=list-style-type:none;padding:0 ><li><a href=https://www.linkedin.com/in/franckcornu/ target=_blank>Franck Cornu</a></ul></span><img class="w-[72px]" src=${require("../controls/WebPartPlaceholder/logo.svg")} alt="PnP logo"/></div>`,
                key: 'authors'
              }),
              PropertyPaneLabel('', {
                text: `${commonStrings.PropertyPane.InformationPage.Version}: ${this && this.manifest.version ? this.manifest.version : ''}`
              }),   
              PropertyPaneLabel('', {
                text: `${commonStrings.PropertyPane.InformationPage.InstanceId}: ${this.instanceId}`
              }),            
            ]
          },
          {
            groupName: commonStrings.PropertyPane.InformationPage.Resources.GroupName,
            groupFields: [
              PropertyPaneLink('',{
                target: '_blank',
                href: this.properties.documentationLink,
                text: commonStrings.PropertyPane.InformationPage.Resources.Documentation
              }),
              PropertyPaneLink('',{
                target: '_blank',
                href: this.properties.issueLink,
                text: commonStrings.PropertyPane.InformationPage.Resources.IssueLink
              })
            ]
          },
          {
            groupName: commonStrings.PropertyPane.InformationPage.ImportExport,
            groupFields: [
              PropertyPaneWebPartInformation({
                description: `<span style="color:red">${commonStrings.PropertyPane.InformationPage.DeveloperSettingsWarning}</span>`,
                key: 'warning'
              }),
              this._propertyPanePropertyEditor({
                webpart: this,
                key: 'propertyEditor'
              }),
            ],
            isCollapsed: false
        }
      ];
    }

    protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): Promise<void> {
      
      if (propertyPath.localeCompare("colorOverrides") === 0 || propertyPath.localeCompare("followSiteTheme") === 0) {
        
        if (this.properties.followSiteTheme) {
          this.properties.colorOverrides = this._themeVariant.isInverted ? defaultDarkColorOverrides : defaultLightColorOverrides;
        }

        this.setThemeVariables();
      }

       //#region Layout related properties

        // Notify layout a property has been updated (only if the layout is already selected)
        if ((propertyPath.localeCompare('selectedLayoutKey') !== 0) && this.layout) {
          this.layout.onPropertyUpdate(propertyPath, oldValue, newValue);
      }

      // Reset layout properties
      if (propertyPath.localeCompare('selectedLayoutKey') === 0 && !isEqual(oldValue, newValue)) {
          
          this.properties.layoutProperties = {};
          this.layout = await LayoutHelper.getLayoutInstance(this.webPartInstanceServiceScope, this.context, this.properties, this.properties.selectedLayoutKey, this.availableLayoutDefinitions);  
      }

      // Detect if the layout has been changed to custom
      if (propertyPath.localeCompare('inlineTemplateContent') === 0) {

          // Reset the external template file pointer and already fetched content if the inline tempalte is modified
          this.properties.externalTemplateFilePickerResult = null;
          this.externalTemplateContent = null;

          // Automatically switch the option to 'Custom' if a default template has been edited
          // (meaning the user started from a default template)
          if (this.properties.inlineTemplateContent) {
             
            const layoutDefinition = this.availableLayoutDefinitions.filter(layoutDef =>
              layoutDef.key === this.properties.selectedLayoutKey
            )[0];

            switch (layoutDefinition.type) {
              case LayoutType.Results:
                this.properties.selectedLayoutKey = BuiltinLayoutsKeys.ResultsCustom;
                break;
              case LayoutType.Filters:
                this.properties.selectedLayoutKey = BuiltinLayoutsKeys.FiltersCustom;
                break;
            }
          }
      }

      if (propertyPath.localeCompare("externalTemplateFilePickerResult") === 0) {
          this.templateContentToDisplay = await this.fileService.downloadFileContent(this.properties.externalTemplateFilePickerResult);
          this.externalTemplateContent = this.templateContentToDisplay
      }


    }

    protected getThemePageGroup(): IPropertyPaneGroup {

      const colorFieldConfiguration: IConfigurationTab[] = [
        {
            name: commonStrings.PropertyPane.ColorSettingsTabLabel,
            fields: [
              {
                  type: ConfigurationFieldType.Custom,
                  props: {
                  },
                  onCustomRender: (field: IConfigurationTabField, defaultValue: string, onFieldValueUpdate: (field: IConfigurationTabField, value: string) => void) => {
                    const color = getColorFromString(defaultValue);
                    return  <ColorPicker 
                              color={color} 
                              onChange={(ev, colorObj: IColor)  => {
                                  onFieldValueUpdate(field, colorObj.str);
                              }}
                            />
                  },
                  targetProperty: "colorValue",
              }
            ]
        },
      ];

      const mainFormFields: IConfigurationTabField[] = [
        {
            type: ConfigurationFieldType.Custom,
            targetProperty: null,
            onCustomRender: (field, defaultValue, onUpdate) => {

                return  <ConfigurationPanel<ICustomColorField>
                            configurationTabs={colorFieldConfiguration}
                            renderRowTitle={(field: ICustomColorField) => { return field.colorName }}
                            onFormSave={(formData: ICustomColorField) => { 
                              onUpdate(field, formData)
                            }}
                            dataObject={defaultValue}
                            renderPanelTitle={(propsDataObject: ICustomColorField) => { 
                              return propsDataObject.colorName;
                            }}
                        />;
            }
        }
      ];
      
      const themeFields = [
        PropertyPaneToggle('followSiteTheme', {
          label: commonStrings.PropertyPane.FollowSiteTheme,
          checked: this.properties.followSiteTheme
        })
      ];

      if (!this.properties.followSiteTheme) {
        themeFields.push(
          new PropertyPaneFormDataCollection<ICustomColorField>('colorOverrides', {
            label: commonStrings.PropertyPane.CustomColorsFieldName,
            itemRepeaterProps: {
                innerRef: this._colorsItemRepeaterRef,
                addButtonLabel: commonStrings.PropertyPane.CustomColorsAddButtonLabel,    
                enableDragDrop: false,
                disabled: true,
                isItemLocked: (item: ICustomColorField) => {
                  return true;
                }
            },
            items: this.properties.colorOverrides,
            formConfiguration: mainFormFields
          })
        );
      }

      return {
        groupName: commonStrings.PropertyPane.ThemeSettingsGroupName,
        groupFields: themeFields
      };
    }

    protected getTemplateOptionsGroup(): IPropertyPaneGroup {

      const stylingFields: IPropertyPaneField<unknown>[] = [
        PropertyPaneChoiceGroup('selectedLayoutKey', {
            options: LayoutHelper.getLayoutOptions(this.availableLayoutDefinitions)
        })          
      ];

      // We can customize the template for any layout
      stylingFields.push(
          new PropertyPaneCodeEditor('inlineTemplateContent', {
              label: commonStrings.PropertyPane.EditComponentTemplates,          
              defaultValue: this.templateContentToDisplay,
              theme: this._themeVariant,
              isReadOnly: !!this.properties.externalTemplateFilePickerResult && this.properties.selectedLayoutKey === BuiltinLayoutsKeys.ResultsCustom
          }),
          PropertyPaneToggle('enableDebugMode', {
              label: commonStrings.PropertyPane.EnableDebugMode
          }),
          PropertyPaneToggle('useMicrosoftGraphToolkit', {
            label: commonStrings.PropertyPane.UseMicrosoftGraphToolkit
          })
      );

      // Only show the template external URL for 'Custom' option
      if (this.properties.selectedLayoutKey === BuiltinLayoutsKeys.ResultsCustom || this.properties.selectedLayoutKey === BuiltinLayoutsKeys.FiltersCustom) {
          stylingFields.splice(2,0,
              new PropertyPaneFilePicker('externalTemplateFilePickerResult', {
                  label: commonStrings.PropertyPane.UseExternalTemplateFile,
                  componentContext: this.context,
                  filePickerResult: this.properties?.externalTemplateFilePickerResult
              })
          );
      }

      return {
        groupName: commonStrings.PropertyPane.TemplateSettingsGroupName,
        groupFields: stylingFields
      };
    }
    

    protected  async loadResources(): Promise<void> {

      if (this.displayMode === DisplayMode.Edit) {

          const { Placeholder } = await import(
              /* webpackChunkName: '-modern-search-core-property-pane' */
              '@pnp/spfx-controls-react/lib/Placeholder'
          );
          this._placeholderComponent = Placeholder;
      }
    }

    /**
     * Initializes theme variant properties
     */
    private initThemeVariant(): void {

        // Consume the new ThemeProvider service
        this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

        // If it exists, get the theme variant
        this._themeVariant = this._themeProvider.tryGetTheme();

        // Register a handler to be notified if the theme variant changes
        this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent.bind(this));
    }

    /**
     * Update the current theme variant reference and re-render.
     * @param args The new theme
     */
    private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {

        if (!isEqual(this._themeVariant, args.theme)) {
            this._themeVariant = args.theme;
            this.setThemeVariables();
            this.render();
        }
    }

    private setThemeVariables(): void {

      const setCommonStyles = (): void => {
        this.domElement.style.setProperty(ThemePublicCSSVariables.colorPrimary, this._themeVariant.palette.themePrimary);
        this.domElement.style.setProperty(ThemePublicCSSVariables.fontFamilyPrimary, this._themeVariant.fonts.medium.fontFamily);
        this.domElement.style.setProperty(ThemePublicCSSVariables.fontFamilySecondary, this._themeVariant.fonts.medium.fontFamily);
      }

      const setDarkMode = (): void => {
        this.domElement.style.setProperty(ThemePublicCSSVariables.primaryBackgroundColorDark, this._themeVariant.semanticColors.bodyBackground);
        this.domElement.style.setProperty(ThemePublicCSSVariables.textColorDark, this._themeVariant.semanticColors.bodyText);
      
        this.domElement.style.removeProperty(ThemePublicCSSVariables.primaryBackgroundColor);
        this.domElement.style.removeProperty(ThemePublicCSSVariables.textColor);
      };

      const setLightMode = (): void => {
        this.domElement.style.setProperty(ThemePublicCSSVariables.primaryBackgroundColor, this._themeVariant.semanticColors.bodyBackground);
        this.domElement.style.setProperty(ThemePublicCSSVariables.textColor, this._themeVariant.semanticColors.bodyText);

        this.domElement.style.removeProperty(ThemePublicCSSVariables.primaryBackgroundColorDark);
        this.domElement.style.removeProperty(ThemePublicCSSVariables.textColorDark);
      };

      if (this.properties.followSiteTheme) {

        setCommonStyles();

        if (this._themeVariant.isInverted) {
          setDarkMode();        
        } else {
          setLightMode();
        }

      } else {

        // Set custom colors values
        this.properties.colorOverrides.forEach(color => {
          this.domElement.style.setProperty(color.colorVariable, color.colorValue);
        });
      }
      
    }

    protected getComponentId(componentType: ComponentType): string {
      return `${this.manifest.componentType}.${this.manifest.id}.${this.instanceId}:${componentType}`;
    }

    protected async initDomPurify(): Promise<void> {

      if (this.properties.selectedLayoutKey === BuiltinLayoutsKeys.ResultsCustom || 
          this.properties.selectedLayoutKey === BuiltinLayoutsKeys.FiltersCustom || 
          this.properties.selectedLayoutKey === BuiltinLayoutsKeys.VerticalsCustom ) {
          
          const DOMPurify = await import(
              /* webpackChunkName: 'pnp-modern-search-core-dompurify' */
              'dompurify'
          );

          this._domPurify = DOMPurify;

          this._domPurify.setConfig({
              CUSTOM_ELEMENT_HANDLING: {
                  tagNameCheck: /^pnp|mgt-/,
                  attributeNameCheck: () => true,
                  allowCustomizedBuiltInElements: true, 
              },
              ADD_TAGS: ['style'],
              ALLOW_DATA_ATTR: true,
              ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|file|tel|callto|cid|xmpp|xxx|ms-\w+):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i           
          });
      }
    }

    protected async initTemplate(): Promise<void> {

      // Gets the template content according to the selected key
      const selectedLayoutTemplateContent = this.availableLayoutDefinitions.filter(layout => { return layout.key === this.properties.selectedLayoutKey; })[0].templateContent;
      let externalTemplateContent;

      if (this.properties.selectedLayoutKey === BuiltinLayoutsKeys.ResultsCustom ||
          this.properties.selectedLayoutKey === BuiltinLayoutsKeys.FiltersCustom ||
          this.properties.selectedLayoutKey === BuiltinLayoutsKeys.VerticalsCustom) {
          
          if (!this._domPurify) {
              await this.initDomPurify();
          }

          if (this.properties.externalTemplateFilePickerResult) {

              if (!this.externalTemplateContent) {
                  externalTemplateContent = await this.fileService.downloadFileContent(this.properties.externalTemplateFilePickerResult);
              } else {
                  externalTemplateContent = this.externalTemplateContent;
              }

              this.templateContentToDisplay = this.sanitizeTemplate(externalTemplateContent)

          } else {
              this.templateContentToDisplay = this.properties.inlineTemplateContent ? this.sanitizeTemplate(this.properties.inlineTemplateContent) : selectedLayoutTemplateContent;
          }

      } else {
          this.templateContentToDisplay = selectedLayoutTemplateContent;
      }
    }

    private sanitizeTemplate(templateContent: string): string {
        return this._domPurify.sanitize(`<div>${templateContent}</div>`).replace(/^<div>/,"").replace(/<\/div>$/,"");
    }
}