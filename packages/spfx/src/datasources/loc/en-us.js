/* eslint-disable no-undef */
define([], function() {
    return {
        General: {
            EmptyFieldErrorMessage: "This field cannot be empty",
        },
        PropertyPane: {
            QuerySettingsGroup: {
                GroupName: "Query settings",
                QueryMode: {
                    BasicMode: "Basic mode (coming soon...)",
                    AdvancedMode: "Advanced mode"
                },
                SearchQueryTextStaticValue: "Static value",
                SearchQueryTextDynamicValue: "Dynamic value",
                SearchQueryTextFieldLabel: "Query text",
                SearchQueryTextFieldDescription: "",
                SearchQueryPlaceHolderText: "Enter query text...",
                SearchQueryTextUseDefaultQuery: "Use a default value",
                SearchQueryTextDefaultValue: "Default value",
                SearchEntityTypeFieldLabel: "Entity types",
                SearchQueryTemplateFieldLabel: "Query template",
                SearchQueryTemplatePlaceHolderText: "ex: Path:{Site}",
                SearchQueryTemplateFieldDescription: "The search query template. You can also use {<tokens>} to build a dynamic query.",
                SearchQueryQueryTemplateApplyBtnText: "Apply",
                SearchContentSourcesFieldLabel: "Content sources",
                SearchContentSourcesAddNewBtnLabel: "Add new connection id",
                SearchContentSourcesPlaceholderLabel: "Enter connection(s) id(s)...",
                FieldTextErrorMessage: "Field must have a value"
            },
            AdvancedSettingsGroup: {
                GroupName: "AdvancedSettings",
                SearchSelectedFieldsFieldLabel: "Fields",
                SearchSelectedFieldsPlaceholderLabel: "Enter field(s) name...",
                SearchEnableResultTypesFieldLabel: "Enable result types",
                SearchUseBetaEndpointFieldLabel: "Use beta endpoint",
                SearchEnableSuggestionFieldLabel: "Enable suggestions",
                SearchEnableModificationFieldLabel: "Enable modifications",
                SearchFiltersFieldsFieldLabel: "Get filters configuration from this Web Part",
                SearchFiltersUseFiltersFieldLabel: "Use filters/sort",
                SortFieldLabel: "Sort field",
                SortDirectionLabel: "Sort direction",
                IsDefaultSort: "Is default sort",
                IsUserSort: "Is user sort",
                SortDisplayName:  "Display name",
                SortPropertiesCategory: "Sort properties",
                AddNewSortPropertyLabel: "Add new sort property"
            },
            PagingSettingsGroup: {
                GroupName: "Paging settings",
                SearchPageSizeFieldLabel: "Page size",
                SearchPagesNumberFieldLabel: "Number of pages to show",
                SearchShowPagingFieldLabel: "Show paging"
            }
        }
    }
})