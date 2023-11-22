declare interface IMicrosoftSearchDataSourceStrings {
    General: {
        EmptyFieldErrorMessage: string;
    },
    PropertyPane: {
        QuerySettingsGroup: {
            GroupName: string;
            QueryMode: string;
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
