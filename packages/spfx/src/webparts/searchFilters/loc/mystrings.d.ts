declare interface ISearchFiltersWebPartStrings {
  General: {
    PlaceHolder: {
        EditLabel: string;
        IconText: string;
        Description: string;
        ConfigureBtnLabel: string;
    },
    NoAvailableFilterMessage: string;
    WebPartDefaultTitle: string;
},
PropertyPane: {
    CommonSettings: {
        UseSearchResultsWebPartLabel: string;
        FilterOperatorLabel: string;
        ANDOperator: string;
        OROperator: string;
    },
    FiltersSettings: {
        SettingsGroupName: string;
    }
}
}

declare module 'SearchFiltersWebPartStrings' {
  const strings: ISearchFiltersWebPartStrings;
  export = strings;
}
