export { SearchResultsComponent } from "../components/search-results/SearchResultsComponent";
export { SearchInputComponent }  from "../components/search-input/SearchInputComponent";
export { SearchVerticalsComponent } from "../components/search-verticals/SearchVerticalsComponent";
export { SearchFiltersComponent } from "../components/search-filters/SearchFiltersComponent";
export { LanguageProvider } from "../components/language-provider/LanguageProvider";
export { AdaptiveCardComponent } from "../components/adaptive-card/AdaptiveCardComponent";
export { VideoPlayerComponent } from "../components/video-player/VideoPlayerComponent";
export { LabelComponent } from "../components/label/LabelComponent";

// Needed to work with SPFx as we can't use the default mgt-spfx package
export * from "@microsoft/mgt-sharepoint-provider";
export * from "@microsoft/mgt-teamsfx-provider";
export * from "@microsoft/mgt-msal2-provider";
export * from "@microsoft/mgt-element/dist/es6/providers/SimpleProvider";

export * from "@microsoft/mgt-element/dist/es6/utils/TemplateHelper";
export * from "@microsoft/mgt-element/dist/es6/providers/IProvider";
export * from "@microsoft/mgt-element/dist/es6/providers/Providers";
export * from "@microsoft/mgt-element/dist/es6/utils/LocalizationHelper";

// To be able to use MGT components alongside search components
export * from "@microsoft/mgt-components";