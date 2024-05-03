//#region Imports
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneConfiguration, 
  IPropertyPaneField, 
  IPropertyPanePage, 
  PropertyPaneDropdown, 
  PropertyPaneTextField, 
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import * as commonStrings from "CommonStrings";
import * as webPartStrings from 'SearchBoxWebPartStrings';
import { SearchBox } from './components/SearchBox';
import { ISearchBoxProps } from './components/ISearchBoxProps';
import { IDynamicDataCallables, IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';
import { BaseWebPart } from '../../common/BaseWebPart';
import { ComponentType } from '../../common/ComponentType';
import { PageOpenBehavior, QueryPathBehavior } from '@pnp/modern-search-core/dist/es6/helpers/UrlHelper';
import { ISearchBoxWebPartProps } from './ISearchBoxWebPartProps';
import { ILayoutDefinition } from '../../models/common/ILayoutDefinition';
//#endregion

export default class SearchBoxWebPart extends BaseWebPart<ISearchBoxWebPartProps> implements IDynamicDataCallables {
  
  protected availableLayoutDefinitions: ILayoutDefinition[] = [];

  //#region Class methods

  //#region WebPart lifecycle methods

  protected async onInit(): Promise<void> {

    await super.onInit();

    this.context.dynamicDataSourceManager.initializeSource(this);
  }

  public render(): void {
   
    const element: React.ReactElement<ISearchBoxProps> = React.createElement(
      SearchBox,
      {
        ...this.properties,
        id: this.getComponentId(ComponentType.SearchBox),
        theme: this._themeVariant.isInverted ? "dark" : ""
      } as ISearchBoxProps
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  //#endregion

  //#region Dynamic Data methods

  public getPropertyDefinitions(): IDynamicDataPropertyDefinition[] {

    // Use the Web Part title as property title since we don't expose sub properties
    const propertyDefinitions: IDynamicDataPropertyDefinition[] = [];

    propertyDefinitions.push(
        {
            id: ComponentType.SearchBox,
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
    
    const propertyPanePages: IPropertyPanePage[] = [
      {
          groups: [
              {
                  groupName: webPartStrings.PropertyPane.SearchBoxSettingsGroup.GroupName,
                  groupFields: this._getSearchBoxSettingsFields()
              }
          ],
          displayGroupsAsAccordion: true
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
    ];

    return {
      pages: propertyPanePages
    };
  }

  /**
   * Determines the group fields for the search options inside the property pane
   */
  private _getSearchBoxSettingsFields(): IPropertyPaneField<unknown>[] {

      let searchBehaviorOptionsFields: IPropertyPaneField<unknown>[] = [
          PropertyPaneTextField('inputPlaceholder', {
              label: webPartStrings.PropertyPane.SearchBoxSettingsGroup.PlaceholderTextLabel
          }),
          PropertyPaneToggle("searchInNewPage", {
              label: webPartStrings.PropertyPane.SearchBoxSettingsGroup.SearchInNewPageLabel
          }),
      ];


      if (this.properties.searchInNewPage) {
          searchBehaviorOptionsFields = searchBehaviorOptionsFields.concat([
              PropertyPaneTextField('pageUrl', {
                  disabled: !this.properties.searchInNewPage,
                  label: webPartStrings.PropertyPane.SearchBoxSettingsGroup.PageUrlLabel,
                  onGetErrorMessage: this._validatePageUrl.bind(this),
                  validateOnFocusOut: true,
                  validateOnFocusIn: true,
                  placeholder: 'https://...'
              }),
              PropertyPaneDropdown('openBehavior', {
                  label: commonStrings.General.PageOpenBehaviorLabel,
                  options: [
                      { key: PageOpenBehavior.Self, text: commonStrings.General.SameTabOpenBehavior },
                      { key: PageOpenBehavior.NewTab, text: commonStrings.General.NewTabOpenBehavior }
                  ],
                  disabled: !this.properties.searchInNewPage,
                  selectedKey: this.properties.openBehavior
              }),
              PropertyPaneDropdown('queryPathBehavior', {
                  label: webPartStrings.PropertyPane.SearchBoxSettingsGroup.QueryPathBehaviorLabel,
                  options: [
                      { key: QueryPathBehavior.URLFragment, text: webPartStrings.PropertyPane.SearchBoxSettingsGroup.UrlFragmentQueryPathBehavior },
                      { key: QueryPathBehavior.QueryParameter, text: webPartStrings.PropertyPane.SearchBoxSettingsGroup.QueryStringQueryPathBehavior }
                  ],
                  disabled: !this.properties.searchInNewPage,
                  selectedKey: this.properties.queryPathBehavior
              })
          ]);
      }

      if (this.properties.searchInNewPage && this.properties.queryPathBehavior === QueryPathBehavior.QueryParameter) {
          searchBehaviorOptionsFields = searchBehaviorOptionsFields.concat([
              PropertyPaneTextField('queryStringParameter', {
                  disabled: !this.properties.searchInNewPage || this.properties.searchInNewPage && this.properties.queryPathBehavior !== QueryPathBehavior.QueryParameter,
                  label: webPartStrings.PropertyPane.SearchBoxSettingsGroup.QueryStringParameterName,
                  onGetErrorMessage: (value) => {
                      if (this.properties.queryPathBehavior === QueryPathBehavior.QueryParameter) {
                          if (value === null ||
                              value.trim().length === 0) {
                              return webPartStrings.PropertyPane.SearchBoxSettingsGroup.QueryParameterNotEmpty;
                          }
                      }
                      return '';
                  }
              })
          ]);
      }

      return searchBehaviorOptionsFields;
  }

    /**
   * Verifies if the string is a correct URL
   * @param value the URL to verify
   */
  private _validatePageUrl(value: string): string {

      if ((!(/^(https?):\/\/[^\s/$.?#].[^\s]*/).test(value) || !value) && this.properties.searchInNewPage) {
          return webPartStrings.PropertyPane.SearchBoxSettingsGroup.UrlErrorMessage;
      }

      return '';
  }

  //#endregion

  //#endregion
}
