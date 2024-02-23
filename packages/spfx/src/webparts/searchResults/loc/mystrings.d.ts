declare interface ISearchResultsWebPartStrings {
  General: {
    PlaceHolder: {
        EditLabel: string;
        IconText: string;
        Description: string;
        ConfigureBtnLabel: string;
    },
    WebPartDefaultTitle: string;
  },
  PropertyPane: {
    LayoutPage: {
      LayoutTemplateOptionsGroupName: string;
      CommonLayoutOptionsGroupName: string;
      UseSearchVerticalsField: string;
      SearchVerticalsConnectToComponentField: string;
      SearchVerticalsConnectionField: string;
    }
  }
}

declare module 'SearchResultsWebPartStrings' {
  const strings: ISearchResultsWebPartStrings;
  export = strings;
}
