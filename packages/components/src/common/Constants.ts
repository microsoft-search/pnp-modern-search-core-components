export class EventConstants {

    /**
     * Event name when filters are submitted
     */
    public static readonly SEARCH_FILTER_EVENT = "PnPModernSearchCoreComponents:Search:Filter";

    /**
     * Event name when results are retrieved
     */
    public static readonly SEARCH_RESULTS_EVENT = "PnPModernSearchCoreComponents:Search:Results";
    /**
     * Event name when input is sent
     */
    public static readonly SEARCH_INPUT_EVENT = "PnPModernSearchCoreComponents:Search:Input";

    /**
     * Event name when tab change is retrieved
     */
    public static readonly SEARCH_VERTICAL_EVENT = "PnPModernSearchCoreComponents:Search:Verticals";

    /**
     * Event name when sort field is updated
     */
    public static readonly SEARCH_SORT_EVENT = "PnPModernSearchCoreComponents:Search:Sort";

    /**
     * Event name when MGT components are loaded on-demand
     */
    public static readonly SEARCH_MGT_COMPONENTS_LOADED = "PnPModernSearchCoreComponents:Components:Search:MgtComponentsLoaded";
}

export enum ErrorTypes {
    BindingTimeoutError,
    GeneralError
}

export enum ComponentElements {
    SearchResultsComponent = "pnp-search-results",
    SearchFiltersComponent = "pnp-search-filters",
    CheckboxFilterComponent = "pnp-filter-checkbox",
    DateFilterComponent = "pnp-filter-date",
    SearchSortComponent = "pnp-search-sort",
    PaginationComponent = "pnp-pagination",
    SearchInputComponent = "pnp-search-input",
    SearchVerticalsComponent = "pnp-search-verticals",
    AdaptiveCardComponent = "pnp-adaptive-card",
    LanguageProviderComponent = "pnp-language-provider",
    ThemeProviderComponent = "pnp-theme-provider",
    SearchInfosComponent = "pnp-search-infos",
    ErrorMessageComponent = "pnp-error-message",
    VideoPlayerComponent = "pnp-video-player",
    LabelComponent = "pnp-label"
}

/**
 * Internal CSS variables for components. Not intended to be set by the host application
 */
export enum ThemeInternalCSSVariables {
    fontFamilyPrimary = "--pnpsearch-internal-fontFamilyPrimary",
    fontFamilySecondary = "--pnpsearch-internal-fontFamilySecondary",
    colorPrimary = "--pnpsearch-internal-colorPrimary",
    colorPrimaryHover = "--pnpsearch-internal-colorPrimaryHover",
    textColor = "--pnpsearch-internal-textColor",
    textLight = "--pnpsearch-internal-textLight",
    primaryBackgroundColorDark = "--pnpsearch-internal-colorBackgroundDarkPrimary",
    primaryBackgroundColor = "--pnpsearch-internal-colorBackgroundPrimary",
    textColorDark = "--pnpsearch-internal-textColorDark",
}

/**
 * CSS Variables exposed to parent application that can be override 
 */
export enum ThemePublicCSSVariables {
    fontFamilyPrimary = "--pnpsearch-fontFamilyPrimary",
    fontFamilySecondary = "--pnpsearch-fontFamilySecondary",
    colorPrimary = "--pnpsearch-colorPrimary",
    colorPrimaryHover = "--pnpsearch-colorPrimaryHover",
    textColor = "--pnpsearch-textColor",
    primaryBackgroundColor = "--pnpsearch-colorBackgroundPrimary",
    primaryBackgroundColorDark = "--pnpsearch-colorBackgroundDarkPrimary",
    textColorDark = "--pnpsearch-textColorDark",
}

/**
 * Default CSS variables values in the case where they are not set in the parent application and used outside of Tailwind classes (ex: bg-myVarName)
 */
export enum ThemeDefaultCSSVariablesValues {
    defaultColorPrimary = "#7C4DFF",
    defaultColorPrimaryHover = "#651fff",
    defaultTextColor = "#1E252B",
    defaultTextLight = "rgba(30, 37, 43, 0.6)",
    defaultFontFamilyPrimary = "Segoe UI",
    defaultFontFamilySecondary = "Roboto",
    primaryBackgroundColorDark = "#3b3b3b",
    primaryBackgroundColor = "#F3F5F6",
    textColorDark = "#FFF"
}