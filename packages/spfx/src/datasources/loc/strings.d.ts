declare interface IMicrosoftSearchDataSourceStrings {
    General: {
        EmptyFieldErrorMessage: string;
    },
    PropertyPane: {
        QuerySettingsGroup: {
            GroupName: string;
            QueryMode: {
                BasicMode: string;
                AdvancedMode: string;
            },
            SearchQueryTextStaticValue: string;
            SearchQueryTextDynamicValue: string;
            SearchQueryTextFieldLabel: string;
            SearchQueryTextFieldDescription: string;
            SearchQueryPlaceHolderText: string;
            SearchQueryTextUseDefaultQuery: string;
            SearchQueryTextDefaultValue: string;
            SearchEntityTypeFieldLabel: string;
            SearchQueryTemplateFieldLabel: string;
            SearchQueryTemplatePlaceHolderText: string;
            SearchQueryTemplateFieldDescription: string;
            SearchQueryQueryTemplateApplyBtnText: string;
            SearchContentSourcesFieldLabel: string;
            SearchContentSourcesAddNewBtnLabel: string;
            SearchContentSourcesPlaceholderLabel: string;
            FieldTextErrorMessage: string;
        },
        AdvancedSettingsGroup: {
            GroupName: string;
            SearchSelectedFieldsFieldLabel: string;
            SearchSelectedFieldsPlaceholderLabel: string;
            SearchEnableResultTypesFieldLabel: string;
            SearchUseBetaEndpointFieldLabel: string;
            SearchEnableSuggestionFieldLabel: string;
            SearchEnableModificationFieldLabel: string;
            SearchFiltersFieldsFieldLabel: string;
            SearchFiltersUseFiltersFieldLabel: string;
            SortFieldLabel: string;
            SortDirectionLabel: string;
            IsDefaultSort: string;
            IsUserSort: string;
            SortDisplayName:  string;
            SortPropertiesCategory: string;
            AddNewSortPropertyLabel: string;
        }
        PagingSettingsGroup: {
            GroupName: string;
            SearchPageSizeFieldLabel: string;
            SearchPagesNumberFieldLabel: string;
            SearchShowPagingFieldLabel: string;
        }
    }
}
  
declare module 'MicrosoftSearchDataSourceStrings' {
    const strings: IMicrosoftSearchDataSourceStrings;
    export = strings;
}
