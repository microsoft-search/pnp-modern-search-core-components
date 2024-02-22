import { ProviderState } from "@microsoft/mgt-element/dist/es6/providers/IProvider";
import { Providers } from "@microsoft/mgt-element/dist/es6/providers/Providers";
import { LocalizationHelper } from "@microsoft/mgt-element/dist/es6/utils/LocalizationHelper";
import { css, html, PropertyValues, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { IDataSourceData } from "../../models/common/IDataSourceData";
import { IMicrosoftSearchQuery, SearchAggregationSortBy, ISearchRequestAggregation, EntityType, ISearchSortProperty } from "../../models/search/IMicrosoftSearchRequest";
import { IMicrosoftSearchService, SearchResource } from "../../services/microsoftSearchService/IMicrosoftSearchService";
import { ITemplateService } from "../../services/templateService/ITemplateService";
import { MicrosoftSearchService } from "../../services/microsoftSearchService/MicrosoftSearchService";
import { TemplateService } from "../../services/templateService/TemplateService";
import { isEmpty, isEqual } from "lodash-es";
import { ISearchFiltersEventData } from "../../models/events/ISearchFiltersEventData.ts";
import { DataFilterHelper } from "../../helpers/DataFilterHelper";
import { ISearchResultsEventData } from "../../models/events/ISearchResultsEventData";
import { BaseComponent } from "../BaseComponent";
import { ComponentElements, EventConstants, ThemeInternalCSSVariables } from "../../common/Constants";
import { FilterSortDirection, FilterSortType } from "../../models/common/IDataFilterConfiguration";
import { SearchFiltersComponent } from "../search-filters/SearchFiltersComponent";
import { BuiltinFilterTemplates } from "../../models/common/BuiltinTemplate";
import { DateHelper } from "../../helpers/DateHelper";
import { PaginationComponent } from "./sub-components/pagination/PaginationComponent";
import { SearchInputComponent } from "../search-input/SearchInputComponent";
import { sanitizeSummary, SearchResponseEnhancedFields, SearchResultsHelper } from "../../helpers/SearchResultsHelper";
import { ISearchVerticalEventData } from "../../models/events/ISearchVerticalEventData";
import { SearchVerticalsComponent } from "../search-verticals/SearchVerticalsComponent";
import { repeat } from "lit/directives/repeat.js";
import { ISearchInputEventData } from "../../models/events/ISearchInputEventData";
import { UrlHelper } from "../../helpers/UrlHelper";
import { SearchResultsStrings as strings } from "../../loc/strings.default";
import { ILocalizedString } from "../../models/common/ILocalizedString";
import { nothing } from "lit";
import { BuiltinTokenNames, TokenService } from "../../services/tokenService/TokenService";
import { ITokenService } from "../../services/tokenService/ITokenService";
import { ErrorMessageComponent } from "./sub-components/error-message/ErrorMessageComponent";
import { ISortFieldConfiguration, SortFieldDirection } from "../../models/common/ISortFieldConfiguration";
import { ISearchSortEventData } from "../../models/events/ISearchSortEventData";
import { MonacoEditorComponent } from "./sub-components/monaco-editor/MonacoEditorComponent";
import { IComponentBinding } from "../../models/common/IComponentBinding";
import { ComponentEventType } from "../../models/events/EventType";
import { getSvg, SvgIcon } from "@microsoft/mgt-components/dist/es6/utils/SvgHelper";
import { trimFileExtension, getNameFromUrl } from "@microsoft/mgt-components/dist/es6/utils/Utils";
import { SearchHit } from "@microsoft/microsoft-graph-types";
import { MgtFile } from "@microsoft/mgt-components/dist/es6/components/mgt-file/mgt-file";
import { MgtPerson } from "@microsoft/mgt-components/dist/es6/components/mgt-person/mgt-person";

// Re-export base MGT classes to avoid constructor conflicts if they are already defined in the host application
export class MgtFileScopedElement extends MgtFile {
}

export class MgtPersonScopedElement extends MgtPerson {
}

export class SearchResultsComponent extends BaseComponent {

    //#region Attributes

    /**
     * Flag indicating if the beta endpoint for Microsoft Graph API should be used
     */
    @property({ type: Boolean, attribute: "use-beta" })
    useBetaEndpoint = false;

    /**
     * The Microsoft Search entity types to query
     */
    @property({
        type: String, attribute: "entity-types", converter: {
            fromAttribute: (value) => {
                return value.split(",") as EntityType[];
            },
        }
    })
    entityTypes: EntityType[] = [EntityType.ListItem];

    /**
     * The default query text to apply.
     * Query string parameter and search box have priority over this value during first load
     */
    @property({ type: String, attribute: "query-text" })
    defaultQueryText: string;

    /**
     * The search query template to use. Support tokens https://learn.microsoft.com/en-us/graph/search-concept-query-template
     */
    @property({ type: String, attribute: "query-template" })
    queryTemplate: string;

    /**
     * If specified, get the default query text from this query string parameter name
     */
    @property({ type: String, attribute: "default-query-string-parameter"})
    defaultQueryStringParameter: string;

    /**
     * Search managed properties to retrieve for results and usable in the results template. 
     * Comma separated. Refer to the [Microsoft Search API documentation](https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-1.0&preserve-view=true#scope-search-based-on-entity-types) to know what properties can be used according to entity types.
     */
    @property({
        type: Array, attribute: "fields", converter: {
            fromAttribute: (value) => {
                return value.split(",");
            },
        }
    })
    selectedFields: string[] = ["name","title","summary","created","createdBy","filetype","defaultEncodingURL","lastModifiedTime","modifiedBy","path","hitHighlightedSummary","SPSiteURL","SiteTitle"];

    /**
     * Sort properties for the request
     */
    @property({ type: String, attribute: "sort-properties", converter: {
            fromAttribute: (value) => {
                try {
                    return JSON.parse(value);
                } catch {
                    return null;
                }
            },
        }
    })
    sortFieldsConfiguration: ISortFieldConfiguration[] = [];

    /**
     * Flag indicating if the pagination control should be displayed
     */
    @property({ type: Boolean, attribute: "show-paging" })
    showPaging: boolean;

    /**
     * The number of results to show per results page
     */
    @property({ type: Number, attribute: "page-size" })
    pageSize = 10;

    /**
     * The number of pages to display in the pagination control
     */
    @property({ type: Number, attribute: "pages-number" })
    numberOfPagesToDisplay = 5;

    /**
     * Flag indicating if Micrsoft Search result types should be applied in results
     */
    @property({ type: Boolean, attribute: "enable-result-types" })
    enableResultTypes: boolean;

    /**
     * If "entityTypes" contains "externalItem", specify the connection id of the external source
     */
    @property({
        type: String, attribute: "connections", converter: {
            fromAttribute: (value) => {
                return !isEmpty(value) ? value.split(",").map(v => `/external/connections/${v}`) as string[] : [];
            },
        }
    })
    connectionIds: string[];

    /**
     * Indicates whether spelling modifications are enabled. If enabled, the user will get the search results for the corrected query in case of no results for the original query with typos.
     */
    @property({ type: Boolean, attribute: "enable-modification"})
    enableModification = false;

    /**
     * Indicates whether spelling suggestions are enabled. If enabled, the user will get the search results for the original search query and suggestions for spelling correction
     */
    @property({ type: Boolean, attribute: "enable-suggestion"})
    enableSuggestion = false;

    /**
     * If specified, shows the title on top of the results
     */
    @property({ type: String, attribute: "comp-title", converter: {
        fromAttribute: (value) => {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        },
    }
    })
    componentTitle: string | ILocalizedString;

    /**
     * If specified, shows a "See all" link at top top of the results
     */
    @property({ type: String, attribute: "see-all-link" })
    seeAllLink: string;

    /**
     * If specified, show the results count at the top of the results
     */
    @property({ type: Boolean, attribute: "show-count" })
    showCount: boolean;

    /**
     * The search filters component ID if connected to a search filters
     */
    @property({ type: String, attribute: "search-filters-id", reflect: true })
    searchFiltersComponentId: string;

    /**
     * The search input component ID if connected to a search input
     */
    @property({ type: String, attribute: "search-input-id", reflect: true })
    searchInputComponentId: string;

    /**
     * The search verticals component ID if connected to a search verticals
     */
    @property({ type: String, attribute: "search-verticals-id", reflect: true })
    searchVerticalsComponentId: string;

    /**
     * The search sort component ID if connected to a search sort component
     */
    @property({ type: String, attribute: "search-sort-id", reflect: true })
    searchSortComponentId: string;

    /**
     * If connected to a search verticals component on the same page, determines on which keys this component should be displayed
     */
    @property({
        type: Array, attribute: "verticals-keys", converter: {
            fromAttribute: (value) => {
                return value.split(",");
            },
        }
    })
    selectedVerticalKeys: string[];
    
    /**
     * Flag indicating if the loading indication (spinner/shimmers) should be displayed when fectching the data
     */
    @property({ type: Boolean, attribute: "no-loading" })
    noLoadingIndicator: boolean;
    
    //#endregion

    //#region State properties

    @state()
    data: IDataSourceData = { items: [] };

    @state()
    isLoading = true;


    @state()
    shouldRender: boolean;

    @state()
    override error: Error = null;

    //#endregion

    //#region Class properties
    declare public searchQuery: IMicrosoftSearchQuery;
    declare public msSearchService: IMicrosoftSearchService;
    declare private templateService: ITemplateService;
    declare private tokenService: ITokenService;
    declare private dateHelper: DateHelper;
    declare private searchResultsHelper: SearchResultsHelper;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    declare private dayJs: any;
    declare private currentLanguage: string;
    declare sortProperties: ISearchSortProperty[];

    declare _searchRequestAggregations: ISearchRequestAggregation[];

    //#endregion

    //#region Render functions

    private renderDefaultItems() {
        return html`
                ${repeat(
                    this.data.items,
                    (item) => item.hitId,
                    (item, i) => {

                        let renderResult = null;
                        switch (item.resource["@odata.type"]) {
                            case "#microsoft.graph.driveItem":
                                renderResult = this.renderDriveItem(item);
                                break;
                            case "#microsoft.graph.site":
                                renderResult = this.renderSite(item);
                                break;
                            case "#microsoft.graph.person":
                                renderResult = this.renderPerson(item);
                                break;
                            case "#microsoft.graph.drive":
                            case "#microsoft.graph.list":
                                renderResult = this.renderList(item);
                                break;
                            case "#microsoft.graph.listItem":
                                renderResult = this.renderListItem(item);
                                break;
                            case "#microsoft.graph.search.bookmark":
                                renderResult = this.renderBookmark(item);
                                break;
                            case "#microsoft.graph.search.acronym":
                                renderResult = this.renderAcronym(item);
                                break;
                            case "#microsoft.graph.search.qna":
                                renderResult = this.renderQnA(item);
                                break;
                            default:
                                renderResult = this.renderDefault(item);
                        }

                        return html`
                            <div id=${item.hitId} data-ref="item" class="font-primary">
                                ${renderResult}
                                ${i < this.data.items.length-1 ? html`<fast-divider class="border-t-[1px]"></fast-divider>`: nothing}
                            </div>
                        `;                        
                    }
                )}
        `;
    }

    private renderHeader() {

        return html`
            <div class="font-primary flex items-end justify-between mb-4 dark:text-textColorDark">
                <div class="space-x-2">
                ${this.componentTitle ?
                    html`
                        <div data-ref="component-title" class="text-3xl inline-block selection:tracking-[0.0012em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradientFrom to-gradientTo">${this.getLocalizedString(this.componentTitle)}</div>
                    `
                    : null
                }
                ${this.showCount && !this.isLoading ?
                    html`
                        <div data-ref="show-count" class="text-sm inline-block font-normal font-sans">${this.data.totalCount} ${this.strings.results}</div>
                    `
                    : null
                }                            
                </div>
                ${this.renderSeeAllLink()}
            </div>
        `;
    }

    private renderSeeAllLink() {

        return this.seeAllLink && this.data.totalCount > 0 ?
                html`
                    <div class="text-sm text-primary">
                        <a data-ref="see-all-link" class="flex items-center rounded text-primary hover:text-primaryHover focus:outline focus:outline-2 focus-visible:outline focus-visible:outline-2" href="${this.tokenService.resolveTokens(this.seeAllLink) as string}" title=${this.strings.seeAllLink}>
                            <span>${this.strings.seeAllLink}</span>
                            <svg width="18" height="15" viewBox="0 0 18 18" class="fill-current ml-4" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.526 14.29C11.526 14.29 16.027 9.785 17.781 8.03C17.927 7.884 18 7.69199 18 7.49999C18 7.30799 17.927 7.11699 17.781 6.97C16.028 5.21599 11.526 0.711995 11.526 0.711995C11.382 0.566995 11.192 0.494995 11.002 0.494995C10.809 0.494995 10.617 0.568995 10.47 0.715995C10.177 1.00799 10.175 1.482 10.466 1.772L15.444 6.74999H0.751953C0.337953 6.74999 0.00195312 7.08599 0.00195312 7.49999C0.00195312 7.91399 0.337953 8.24999 0.751953 8.24999H15.444L10.465 13.229C10.176 13.518 10.179 13.991 10.471 14.283C10.619 14.431 10.812 14.505 11.004 14.505C11.194 14.505 11.382 14.433 11.526 14.29Z"/>
                            </svg>
                        </a>
                    </div>
                `
            : null;
    }

    private renderOverlay() {
        return html`
            <div class="absolute bg-white bg-opacity-60 dark:bg-opacity-0 h-full w-full flex items-center justify-center">
                <fast-progress-ring></fast-progress-ring>
            </div>
        `;
    }

    private renderErrorMessage() {
        return html`<pnp-error-message .error=${this.error}></pnp-error-message>`;
    }

    private renderPagination() {
        return  html`
                    <pnp-pagination 
                            class="flex justify-center p-2 mt-6 mb-6 min-w-full"
                            .theme=${this.theme} 
                            .totalItems=${this.data.totalCount} 
                            .itemsCountPerPage=${this.pageSize} 
                            .numberOfPagesToDisplay=${this.numberOfPagesToDisplay}
                            .onPageNumberUpdated=${this.goToPage}
                        >
                    </pnp-pagination>
                `;
    }

    private renderDriveItem(result: SearchHit) {
        const resource = result.resource as SearchResource;
        return html`
          <div class="mt-4 mb-4 ml-1 mr-1 grid gap-2 grid-cols-searchResult grid-auto-columns-1/2">
            <div class="h-7 w-7">
              <pnp-mgt-file
                .fileDetails=${result.resource}
                view="image">
              </pnp-mgt-file>
            </div>
            <div class="dark:text-textColorDark">
              <div class="font-semibold mt-1 mb-1 ml-0 mr-0">
                <a href="${resource.webUrl}?Web=1" target="_blank">${decodeURIComponent(trimFileExtension(resource.name))}</a>
              </div>
              <div class="flex mt-1 mb-1 ml-0 mr-0pt-[3px] space-x-1">
                <div>
                    ${resource?.lastModifiedBy?.user?.displayName ? `${this.strings.modifiedBy} ${resource?.lastModifiedBy?.user?.displayName}` : null }
                </div>
                <div>
                    ${ resource.lastModifiedDateTime ?
                        this.dayJs().to(this.dayJs(resource.lastModifiedDateTime)): 
                        null
                    }
                </div>
              </div>
              <div class="mt-1 mb-1 ml-0 mr-0 line-clamp-4" .innerHTML="${sanitizeSummary(result.summary)}"></div>
            </div>
            ${
              result[SearchResponseEnhancedFields.ThumbnailUrl] &&
              html`
               <div>
                    <a href="${resource.webUrl}" target="_blank"><img class="rounded-xl h-[72px] max-w-[126px] w-[126px] object-cover" alt="${trimFileExtension(
                    resource.name || getNameFromUrl(resource.webUrl)
                    )}" src="${result[SearchResponseEnhancedFields.ThumbnailUrl] || ""}" /></a>
                </div>`
            }
    
          </div>
        `;
    }

    /**
     * Renders a site entity
     *
     * @param result
     * @returns
     */
    private renderSite(result: SearchHit) {
        const resource = result.resource as SearchResource;
        return html`
            <div class="mt-4 mb-4 ml-1 mr-1 grid gap-2 grid-cols-searchResult ">
            <div class="h-7 w-7 text-textColor">
                ${this.getResourceIcon(resource)}
            </div>
            <div class="dark:text-textColorDark">
                <div class="font-semibold mt-1 mb-1 ml-0 mr-0">
                <a href="${resource.webUrl}" target="_blank">${resource.displayName}</a>
                </div>
                <div>
                <div class="font-semibold mt-1 mb-1 ml-0 mr-0">
                    <a class="" href="${resource.webUrl}" target="_blank">${resource.webUrl}</a>
                </div>
                </div>
                <div class="mt-1 mb-1 ml-0 mr-0 line-clamp-4" .innerHTML="${sanitizeSummary(result.summary)}"></div>
            </div>
            </div>
        `;
    }

    /**
     * Renders a list entity
     *
     * @param result
     * @returns
     */
    private renderList(result: SearchHit) {
        const resource = result.resource as SearchResource;
        return html`
            <div class="mt-4 mb-4 ml-1 mr-1 grid gap-2 grid-cols-searchResult">
            <div class="h-7 w-7">
                <pnp-mgt-file
                    .fileDetails="${result.resource}"
                    view="image"
                >
                </pnp-mgt-file>
            </div>
                <div class="dark:text-textColorDark">
                    <div class="font-semibold mt-1 mb-1 ml-0 mr-0">
                        <a href="${resource.webUrl}?Web=1" target="_blank">
                            ${trimFileExtension(resource.name || getNameFromUrl(resource.webUrl))}
                        </a>
                    </div>
                    <div class="mt-1 mb-1 ml-0 mr-0 line-clamp-4" .innerHTML="${sanitizeSummary(result.summary)}"></div>
                </div>
            </div>
    `;
    }

    /**
     * Renders a listItem entity
     *
     * @param result
     * @returns
     */
    private renderListItem(result: SearchHit) {
        const resource = result.resource as SearchResource;
        return html`
            <div class="mt-4 mb-4 ml-1 mr-1 grid gap-2 grid-cols-searchResult">
                <div class="h-7 w-7 text-textColor">
                    ${resource.webUrl?.endsWith(".aspx") ? getSvg(SvgIcon.News) : getSvg(SvgIcon.FileOuter)}
                </div>
            <div>
            <div class="font-semibold mt-1 mb-1 ml-0 mr-0 dark:text-textColorDark">
                ${ resource.webUrl ? decodeURIComponent(trimFileExtension(resource.name || getNameFromUrl(resource.webUrl))) : nothing }
            </div>
            <div class="flex mt-1 mb-1 ml-0 mr-0 dark:text-textColorDark pt-[3px] space-x-1">
                <div>
                    ${resource?.lastModifiedBy?.user?.displayName ? `${this.strings.modifiedBy} ${resource?.lastModifiedBy?.user?.displayName}` : null }
                </div>
                <div>
                    ${ resource.lastModifiedDateTime ?
                        this.dayJs().to(this.dayJs(resource.lastModifiedDateTime)): 
                        null
                    }
                </div>
            </div>
                <div class="mt-1 mb-1 ml-0 mr-0 line-clamp-4" .innerHTML="${sanitizeSummary(result.summary)}"></div>
            </div>
            ${
                result[SearchResponseEnhancedFields.ThumbnailUrl] &&
                html`
                    <div>
                        <a href="${resource.webUrl}" target="_blank"><img class="rounded-xl h-[72px] max-w-[126px] w-[126px] object-cover" alt="${trimFileExtension(
                        resource.name || getNameFromUrl(resource.webUrl)
                        )}" src="${result[SearchResponseEnhancedFields.ThumbnailUrl] || ""}" /></a>
                    </div>
                `
            }
            </div>
        `;
    }

    /**
     * Renders a person entity
     *
     * @param result
     * @returns
     */
    private renderPerson(result: SearchHit) {
        const resource = result.resource as SearchResource;
        return html`
            <div class="search-result">
                <pnp-mgt-person
                    view="fourLines"
                    person-query=${resource.userPrincipalName}
                    person-card="hover"
                    show-presence="false">
                </pnp-mgt-person>
            </div>
        `;
    }

    /**
     * Renders a bookmark entity
     *
     * @param result
     */
    private renderBookmark(result: SearchHit) {
        return this.renderAnswer(result, SvgIcon.DoubleBookmark);
    }

    /**
     * Renders an acronym entity
     *
     * @param result
     */
    private renderAcronym(result: SearchHit) {
        return this.renderAnswer(result, SvgIcon.BookOpen);
    }

    /**
     * Renders a qna entity
     *
     * @param result
     */
    private renderQnA(result: SearchHit) {
        return this.renderAnswer(result, SvgIcon.BookQuestion);
    }

    /**
     * Renders an answer entity
     *
     * @param result
     */
    private renderAnswer(result: SearchHit, icon: SvgIcon) {
        const resource = result.resource as SearchResource;
        return html`
            <div class="mt-4 mb-4 ml-1 mr-1 grid gap-2 grid-cols-searchResult">
            <div class="h-7 w-7 text-textColor">
                ${getSvg(icon)}
            </div>
            <div class="dark:text-textColorDark">
                <div class="font-semibold mt-1 mb-1 ml-0 mr-0">
                    <a href="${this.getResourceUrl(resource)}?Web=1" target="_blank">${resource.displayName}</a>
                </div>
                <div class="mt-1 mb-1 ml-0 mr-0 line-clamp-4">${sanitizeSummary(resource.description)}</div>
            </div>
            </div>
        `;
    }

    /**
     * Renders any entity
     *
     * @param result
     */
    private renderDefault(result: SearchHit) {
        const resource = result.resource as SearchResource;
        const resourceUrl = this.getResourceUrl(resource);
        return html`
            <div class="mt-4 mb-4 ml-1 mr-1 grid gap-2 grid-cols-searchResult">
            <div class="h-7 w-7 text-textColor">
                ${this.getResourceIcon(resource)}
            </div>
            <div class="dark:text-textColorDark">
                <div class="font-semibold mt-1 mb-1 ml-0 mr-0 ">
                    ${
                        resourceUrl
                        ? html`
                            <a href="${resourceUrl}?Web=1" target="_blank">${this.getResourceName(resource)}</a>
                        `
                        : html`
                            ${this.getResourceName(resource)}
                        `
                    }
                </div>
                <div class="mt-1 mb-1 ml-0 mr-0 line-clamp-4" .innerHTML="${this.getResultSummary(result)}">
                </div>
            </div>
            </div>          
        `;
    }

    //#endregion

    //#region MGT/Lit Lifecycle methods

    static override get scopedElements() { 
        return {
            ...super.scopedElements,
            "pnp-pagination": PaginationComponent,
            "pnp-error-message": ErrorMessageComponent,
            "pnp-monaco-editor": MonacoEditorComponent,
            "pnp-mgt-file": MgtFileScopedElement,
            "pnp-mgt-person": MgtPersonScopedElement
        }; 
    }

    constructor() {

        super();

        this.msSearchService = new MicrosoftSearchService();
        this.templateService = new TemplateService();
        this.tokenService = new TokenService();
        
        this.dateHelper = new DateHelper();
        this.searchResultsHelper = new SearchResultsHelper();

        this.searchQuery = {
            requests: []
        };

        this.addEventListener("templateRendered", (e: CustomEvent) => {
            const element = e.detail.element as HTMLElement;

            if (this.enableResultTypes) {
          
                // Process result types and replace part of HTML with item id
                const newElement = this.templateService.processResultTypesFromHtml(this.data, element, this.getTheme());
                element.replaceWith(newElement);
            }

            // Convert inner text content to HTML
            element.querySelectorAll("[data-html]").forEach(el => {
                el.innerHTML = el.textContent;
            });

            // Set the theme for user defined templates
            element.setAttribute("class", this.theme);
        });

        this.handleSearchVertical = this.handleSearchVertical.bind(this);
        this.handleSearchFilters = this.handleSearchFilters.bind(this);
        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.handleSearchSort = this.handleSearchSort.bind(this);

        this.getSearchInputBinding = this.getSearchInputBinding.bind(this);
        this.getSearchFiltersBinding = this.getSearchFiltersBinding.bind(this);
        this.getSearchVerticalsBinding = this.getSearchVerticalsBinding.bind(this);
        this.getSearchSortBinding = this.getSearchSortBinding.bind(this);

        this.goToPage = this.goToPage.bind(this); 
    }

    public override render() {

        if (this.shouldRender) {

            let renderHeader, renderItems, renderOverlay, renderPagination;

            // Render shimmers
            if (this.hasTemplate("shimmers") && !this.noLoadingIndicator && !this.renderedOnce) {
                renderItems = this.renderTemplate("shimmers", { items: Array(this.pageSize)});
            } else {
            
                // Render loading overlay
                if (this.isLoading && !this.noLoadingIndicator) {
                    renderOverlay = this.renderOverlay();
                } 
            }
            
            // Render error
            if (this.error) {
                return this.renderErrorMessage();
            }

            // Render header
            if (this.componentTitle || this.seeAllLink || this.showCount) {
                renderHeader = this.renderHeader();
            }

            if (this.renderedOnce) {

                if (this.enableDebugMode && this.showDebugData) {
                    renderItems = this.renderDebugData(this.data);
                } else {
                    // Render items
                    if (this.hasTemplate("items")) {
                        renderItems = this.renderTemplate("items", this.data);
                    } else {
                        // Default template for all items
                        renderItems = this.renderDefaultItems();
                    }
                }

                 // Render pagination
                 if (this.showPaging && this.data.items.length > 0) {
                    renderPagination = this.renderPagination();
                }
            }
           
            return html`
                <div class=${this.theme}>
                    <div class="dark:bg-primaryBackgroundColorDark">
                        ${renderHeader}            
                        <div class="relative flex justify-between flex-col">
                            ${renderOverlay}
                            ${this.enableDebugMode ? this.renderDebugMode(): null}
                            ${renderItems}
                            ${renderPagination}
                        </div>
                    </div>     
                </div> 
            `;
        }

        return nothing;        
    }

    public override async connectedCallback(): Promise<void> {

        // Set the flag manually here as the component does not expose default values for other components.
        // To avoid circular dependency loop (this component waiting for others, waiting for this component...) we set the flag right away
        this.isInitialized = true;

        this.dayJs = await this.dateHelper.dayJs(LocalizationHelper.strings?.language as string);

        // Bind connected components
        await this.bindComponents([
            this.getSearchInputBinding(this.searchInputComponentId),
            this.getSearchFiltersBinding(this.searchFiltersComponentId),
            this.getSearchVerticalsBinding(this.searchVerticalsComponentId),
            this.getSearchSortBinding(this.searchSortComponentId)
        ]);

        if (this.enableResultTypes) {
            // Only load adaptive cards bundle if result types are enabled for performance purpose
            await this.templateService.loadAdaptiveCardsResources();
        }

        // Determine the component visibility based of vertical conenction and its current selected tab if any
        this.initVerticalSelectedKeys();

        // Set default sort properties according to configuration
        this.initSortProperties();

        // Build the search query
        this.buildSearchQuery();

        // Set tokens
        this.tokenService.setTokenValue(BuiltinTokenNames.searchTerms, this.getDefaultQueryText());

        return super.connectedCallback();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public override async updated(changedProperties: PropertyValues<this>): Promise<void> {

        // Process result types on default Lit template of this component
        if (this.enableResultTypes && !this.hasTemplate("items")) {
            this.templateService.processResultTypesFromHtml(this.data, this.renderRoot as HTMLElement, this.getTheme());
        }
        
        // Property updates that should trigger a new search
        if (this.hasPropertyUpdated(changedProperties, "queryTemplate") ||
            this.hasPropertyUpdated(changedProperties, "defaultQueryText") ||
            this.hasPropertyUpdated(changedProperties, "selectedFields") ||
            this.hasPropertyUpdated(changedProperties, "pageSize") ||
            this.hasPropertyUpdated(changedProperties, "entityTypes")  ||
            this.hasPropertyUpdated(changedProperties, "enableResultTypes")  ||
            this.hasPropertyUpdated(changedProperties, "useBetaEndpoint")  ||
            this.hasPropertyUpdated(changedProperties, "enableSuggestion") ||
            this.hasPropertyUpdated(changedProperties, "enableModification") ||
            this.hasPropertyUpdated(changedProperties, "connectionIds") ||
            this.hasPropertyUpdated(changedProperties, "searchFiltersComponentId") || 
            this.hasPropertyUpdated(changedProperties, "sortFieldsConfiguration")
        ) {
            // Update the search query
            this.initSortProperties();

            this.tokenService.setTokenValue(BuiltinTokenNames.searchTerms, this.getDefaultQueryText());

            this.buildSearchQuery();
            this._search(this.searchQuery);
        }

        if (changedProperties.has("selectedVerticalKeys")) {
            this.initVerticalSelectedKeys();
        }
        
        // Update bindings
        if (changedProperties.has("searchInputComponentId")) {
            await this.updateBinding(EventConstants.SEARCH_INPUT_EVENT, this.searchInputComponentId, changedProperties.get("searchInputComponentId"));
        }

        if (changedProperties.has("searchFiltersComponentId")) {
            await this.updateBinding(EventConstants.SEARCH_FILTER_EVENT, this.searchFiltersComponentId, changedProperties.get("searchFiltersComponentId"));
        }
        
        if (changedProperties.has("searchVerticalsComponentId")) {
            await this.updateBinding(EventConstants.SEARCH_VERTICAL_EVENT, this.searchVerticalsComponentId, changedProperties.get("searchVerticalsComponentId"));  
            this.initVerticalSelectedKeys();
        }

        if (changedProperties.has("searchSortComponentId")) {
            await this.updateBinding(EventConstants.SEARCH_SORT_EVENT, this.searchSortComponentId, changedProperties.get("searchSortComponentId"));
        }

        this.currentLanguage = LocalizationHelper.strings?.language as string;

        super.updated(changedProperties);
    }

    private async updateBinding(event: EventConstants, newValue: string, previousValue: string): Promise<void> {

        let bindingFunction;

        switch (event) {
            case EventConstants.SEARCH_INPUT_EVENT:
                bindingFunction = this.getSearchInputBinding;
                break;

            case EventConstants.SEARCH_VERTICAL_EVENT:
                bindingFunction = this.getSearchVerticalsBinding;
                break;

            case EventConstants.SEARCH_SORT_EVENT:
                bindingFunction = this.getSearchSortBinding;
                break;

            case EventConstants.SEARCH_FILTER_EVENT:
                bindingFunction = this.getSearchFiltersBinding;
                break;
                    
            default:
                throw new Error("Wrong event type");
        }

        // Unbind
        if (!isEmpty(previousValue) && !isEqual(newValue,previousValue)) {          
          this.unbindComponents([bindingFunction(previousValue)]);
        }

        // Bind 
        if (!isEmpty(newValue)) {
           await this.bindComponents([bindingFunction(newValue)]);
        }   
    }

    /**
     * Only calls when the provider is in ProviderState.SignedIn state
     * @returns 
     */
    public override async loadState(): Promise<void> {
               
        if (this.shouldRender && this.getDefaultQueryText()) {
            await this._search(this.searchQuery);
        } else {
            this.isLoading = false;
        }
    }

    //#endregion

    //#region Static properties accessors
    static override get styles() {

        return [
            css`

                img:before {
                    content: ' ';
                    display: block;
                    position: absolute;
                    height: 93px;
                    background-size: cover;
                    border-radius: 0.75rem;
                    width: 126px;
                    background-image: url('data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMtaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEQzNTUxMTIyRTRFMTFFQUFCMEVGNDk1QjZEODkzQTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEQzNTUxMTMyRTRFMTFFQUFCMEVGNDk1QjZEODkzQTEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowRDM1NTExMDJFNEUxMUVBQUIwRUY0OTVCNkQ4OTNBMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowRDM1NTExMTJFNEUxMUVBQUIwRUY0OTVCNkQ4OTNBMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwODxAPDgwTExQUExMcGxsbHB8fHx8fHx8fHx8BBwcHDQwNGBAQGBoVERUaHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fH//AABEIAlgDIAMBEQACEQEDEQH/xAB1AAEBAQEBAQEBAAAAAAAAAAAAAQUDBgQCCAEBAAAAAAAAAAAAAAAAAAAAABABAAECAgUJBwQDAQEBAAAAAAECAwQFEZGxNBUhMUFR0RJyU3NhccEiMqKyoeFSM0ITI4GCJBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/oMAFAABQAAAUAAFAABQAAAUAAFAABQAAUAAFAABQAAAUAAFAABQAAAUAAFAABQAAAUAAAAFAAABQAAAAUAAAAAFAAAAAAAAAAAAAAAAAAAAABkgAAoAAAKAACgAAoAAKAACgAAoAAAKAACgAAoAAKAACgAAAoAAKAACgAAAoAAKAAACgAAAoAAAAKAAAACgAAAAoAAAAAAAAAAAAAAAAAAAAAMkAAAFAABQAAUAAAFAABQAAUAAFAABQAAUAAFAABQAAAUAAAFABQAAAUAAFAAABQAAAUAAAFAAAABQAAAUAAAAAFAAAAAAAAAAAAAAAAAAAABkAoAAKAACgAAAoAAKAACgAAAoAAKAACgAAoAAAKAACgAoAAAKAACgAAAoAAKAAACgAAAoAAAKAAACgAAAAoAAAAKAAAAAAAAAAAAAAAAAAAADIBQAAAUAAFAAABQAAUAAFAABQAAUAAFAAABQAAUAAFAABQAAAUAAFAABQAAAUAAAFAABQAAAUAAAAFAAAABQAAAAUAAAAAAAAAAAAAAAAAAAGQACgAAAoAAKAACgAAAoAAKAACgAAoAAKAACgAAAoAAKAACgAAoAAAKAACgAAAoAAKAAACgAAAoAAAKAAAACgAAAAAoAAAAAAAAAAAAAAAAAAMgAAFAABQAAAUAAFAABQAAUAAFAAABQAAUAAFAABQAAAUAAFAABQAAUAAAFAABQAAAUAAFAAAABQAAAUAAAFAAAAAABQAAAAAAAAAAAAAAAAAZAAAKAAACgAAoAAAKAACgAAoAAKAACgAAoAAAKAACgAAoAAKAACgAAAoAAKAAACgAAoAAAKAAAACgAAAoAAAKAAAAAACgAAAAAAAAAAAAAAAAyAAAAUAAFAAABQAAUAAAFAABQAAUAAFAABQAAAUAAFAABQAAUAAFAABQAAAUAAAFAABQAAAUAAAFAAAABQAAAUAAAAAFAAAAAAAAAAAAAAAABjgoAAAKAACgAAAoAAKAACgAAAoAAKAACgAAoAAKAACgAAoAAAKAACgAAoAAAKAACgAAAoAAAKAAACgAAAoAAAAKAAAACgAAAAAAAAAAAAAAAAxwAUAAFAAABQAAAUAAFAABQAAUAAFAAABQAAUAAFAABQAAUAAFAAABQAAUAAAFAABQAAAUAAAFAAABQAAAUAAAAFAAAABQAAAAAAAAAAAAAAAY4AKAAACgAAoAAAKAACgAAAoAAKAACgAAoAAKAAACgAAoAAKAACgAAoAAAKAACgAAAoAAKAAACgAAAoAAAKAAAACgAAAAAAoAAAAAAAAAAAAAMcAAFAAABQAAUAAAFAABQAAUAAAFAABQAAUAAFAABQAAUAAAFAABQAAUAAFAAABQAAUAAAFAAABQAAAUAAAFAAAABQAAAAAUAAAAAAAAAAAAAGOAAACgAAAoAAKAACgAAAoAAKAACgAAAoAAKAACgAAoAAKAACgAAAoAAKAACgAAoAAAKAAACgAAoAAAAKAAACgAAAAoAAAAKAAAAAAAAAAAAADHAAABQAAAUAAAFAABQAAUAAAFAABQAAUAAFAAABQAAUAAFAABQAAUAAFAAABQAAUAAAFAABQAAAUAAAFAAABQAAAAAUAAAAFAAAAAAAAAAAABjAoAAAKAAACgAAoAAAKAACgAAAoAAKAACgAAoAAKAACgAAoAAAKAACgAAoAAAKAACgAAAoAAKAAACgAAAoAAAAKAAACgAAAAAoAAAAAAAAAAAMYFAAAABQAAUAAAFAABQAAAUAAFAABQAAAUAAFAABQAAUAAFAABQAAUAAAFAABQAAUAAAFAAABQAAUAAAFAAAABQAAAAUAAAAAFAAAAAAAAAABjAAAoAAKAAACgAAoAAAKAACgAAAoAAKAACgAAoAAKAACgAAAoAAKAACgAAAoAAKAACgAAAoAAKAAACgAAAAoAAAKAAACgAAAAAoAAAAAAAAAAMYAAFAAABQAAAUAAFAAABQAAUAAFAABQAAAUAAFAABQAAUAAFAAABQAAUAAFAAABQAAUAAFAAABQAAAUAAAFA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CgAAoAAAKAACgAAAxwAAAAAAAAAAAAAUAAAAAFAAABQAAAAUAAAFAAABQAAAUAAAFAABQAAUAAFAAABQAAUAAFAABQAAAUAAFAABQAAUAAFAABQAAAUAAAFAABQAAY4AAAAAAAAAAAAAKAAAAACgAAAAoAAAAKAAACgAAAoAAKAAACgAAAoAAKAACgAAoAAKAAACgAAoAAKAACgAAoAAAKAACgAAoAAKAAACgAAAoAMcAAAAAAAAAAAAAAFAAAAABQAAAAUAAAFAAAABQAAUAAAFAAABQAAUAAFAAABQAAUAAFAABQAAUAAAFAABQAAUAAFAABQAAAUAAFAAABQAAUAGOAAAAAAAAAAAAAAACgAAAAoAAAAAKAAACgAAAoAAAKAAACgAAoAAAKAACgAAoAAAKAACgAAoAAKAAACgAAoAAKAACgAAoAAAKAACgAAoAAAKDHAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAABQAAAUAAAFAABQAAAUAAFAAABQAAUAAFAAABQAAUAAFAABQAAUAAFAAABQAAUAAFAAABQAAUAAAGQAAAAAAAAAAAAAAAACgAAAAAoAAAAKAAACgAAAAoAAKAAACgAAAoAAKAACgAAAoAAKAAACgAoAAAKAACgAAoAAKAACgAAAoAAKAACgAAAoAAMgAAAAAAAAAAAAAAAAFAAAAAABQAAAUAAAAFAAAABQAAUAAAFAAABQAAUAAFAABQAAAUAAFAABQAAUAAAFAABQAAUAAFAABQAAAUAAFAAABQAZAAAAAAAAAAAAAAAAAAKAAAAAACgAAAoAAAAKAAACgAAAoAAKAAACgAAAoAAKAACgAAAoAAKAACgAAoAAKAAACgAoAAAKAACgAAoAAAKAACgAyAAAAAAAAAAAAAAAAAAAUAAAAAFAAAABQAAAUAAAAFAAABQAAUAAAFAABQAAAUAAFAABQAAUAAAFAABQAAUAAFAABQAAUAAAFAABQAAUAAAFBkAAAAAAAAAAAAAAAAAAAAoAAAAAKAAAACgAAAoAAAKAAACgAAAoAAAKAACgAAoAAAKAACgAAoAAKAAACgAoAAAKAACgAAoAAAKAACgAAoAAKDIAAAAAAAAAAAAAAAAAAABQAAAAAUAAAAFAAAABQAAAUAAAFAAABQAAUAAAFAABQAAUAAAFAABQAAUAAFAABQAAUAAAFAABQAAUAAFAAABQAAZIAAAAAAAAAAAAAAAAAAAAKAAAAACgAAAAoAAAKAAAACgAAoAAAKAAACgAAoAAAKAACgAAoAAKAACgAAoAAAKAACgAAoAAKAAACgAAoAAKAADJAAAAAAAAAAAAAAAAAAAAABQAAAAAUAAAAFAAABQAAAAUAAFAAABQAAUAAAFAABQAAAUAAFAABQAAUAAFAABQAAUAAAFAABQAAUAAAFAABQAf/9k=');
                }

                // Apply only in SharePoint canvas
                .ControlZone  svg, svg > path {
                    ${unsafeCSS(`fill: var(${ThemeInternalCSSVariables.textColor})`)};
                    height: 100%;
                    width: 100%;
                }

                .ControlZone .dark {
                    svg, svg > path {
                        ${unsafeCSS(`fill: var(${ThemeInternalCSSVariables.textColorDark})`)};
                    } 
                }             
            `,
            BaseComponent.themeStyles, // Allow component to use them CSS variables from design. The component is a first level component so it is OK to define them variables here
            BaseComponent.styles // Use base styles (i.e. Tailwind CSS classes)
        ];
    }

    protected override get strings(): { [x: string]: string; } {
        return strings;
    }

    //#endregion

    //#region Data related methods
    
    private async _search(searchQuery: IMicrosoftSearchQuery): Promise<void> {
        const provider = Providers.globalProvider;
        if (!provider || provider.state !== ProviderState.SignedIn) {
            return;
        }

        try {

            if (this.defaultQueryText) {

                // Reset error
                this.error = null;

                this.isLoading = true;
                const queryLanguage = LocalizationHelper.strings?.language;
                
                const results = await this.msSearchService.search(searchQuery, queryLanguage as string);
                
                // Enhance results
                results.items = await this.searchResultsHelper.enhanceResults(results.items, this.selectedFields);

                // https://lit.dev/docs/components/properties/#mutating-properties
                this.data = {...results};

                this.isLoading = false;

                this.renderedOnce = true;
                            
                // Notify subscribers new filters are available
                this.fireCustomEvent(EventConstants.SEARCH_RESULTS_EVENT, {
                    availableFilters: results.filters,
                    sortFieldsConfiguration: this.sortFieldsConfiguration.filter( s => s.isUserSort),
                    submittedQueryText: this.searchQuery.requests[0].query.queryString,
                    resultsCount: results.totalCount,
                    queryAlterationResponse: results.queryAlterationResponse,
                    from: this.searchQuery.requests[0].from,
                    availableFields: this.searchResultsHelper.getAvailableFieldsFromResults(results)
                } as ISearchResultsEventData);

            } else {
                // render default message
            }

        } catch (error) {
            this.error = error;
        }
    }

    private buildAggregationsFromFiltersConfig(): ISearchRequestAggregation[] {

        let aggregations: ISearchRequestAggregation[] = [];
        const filterComponent = document.getElementById(this.searchFiltersComponentId) as SearchFiltersComponent;
        if (filterComponent && filterComponent.filterConfiguration) {

            // Build aggregations from filters configuration (i.e. refiners)
            aggregations = filterComponent.filterConfiguration.map(filterConfiguration => {

                const aggregation: ISearchRequestAggregation = {
                    field: filterConfiguration.filterName,
                    bucketDefinition: {
                        isDescending: filterConfiguration.sortDirection === FilterSortDirection.Ascending ? false : true,
                        minimumCount: 0,
                        sortBy: filterConfiguration.sortBy === FilterSortType.ByCount ? SearchAggregationSortBy.Count : SearchAggregationSortBy.KeyAsString
                    },
                    size: filterConfiguration && filterConfiguration.maxBuckets ? filterConfiguration.maxBuckets : 10
                };

                if (filterConfiguration.template === BuiltinFilterTemplates.Date) {

                    const pastYear = this.dayJs(new Date()).subtract(1, "years").subtract(1, "minutes").toISOString();
                    const past3Months = this.dayJs(new Date()).subtract(3, "months").subtract(1, "minutes").toISOString();
                    const pastMonth = this.dayJs(new Date()).subtract(1, "months").subtract(1, "minutes").toISOString();
                    const pastWeek = this.dayJs(new Date()).subtract(1, "week").subtract(1, "minutes").toISOString();
                    const past24hours = this.dayJs(new Date()).subtract(24, "hours").subtract(1,"minutes").toISOString();
                    const today = new Date().toISOString();

                    aggregation.bucketDefinition.ranges = [
                        {
                            to: pastYear
                        },
                        {
                            from: pastYear,
                            to: today
                        },
                        {
                            from: past3Months,
                            to: today
                        },
                        {
                            from: pastMonth,
                            to: today
                        },
                        {
                            from: pastWeek,
                            to: today
                        },
                        {
                            from: past24hours,
                            to: today
                        },
                        {
                            from: today
                        }
                    ];
                }

                return aggregation;
            });
        }

        return aggregations;
    }

    /**
     * Builds the search query according to the current component parameters and context
     */
    private buildSearchQuery() {

        this.msSearchService.useBetaEndPoint = this.useBetaEndpoint;
        const searchKeywords = this.getDefaultQueryText();

        // Update token
        this.tokenService.setTokenValue(BuiltinTokenNames.searchTerms, searchKeywords);

        // Build base search query from parameters
        this.searchQuery = {
            requests: [
                {
                    entityTypes: this.entityTypes,
                    fields: this.selectedFields,
                    query: {
                        queryString: searchKeywords,
                        queryTemplate: this.tokenService.resolveTokens(this.queryTemplate)
                    },
                    from: 0,
                    size: this.pageSize,
                    queryAlterationOptions: {
                        enableModification: this.enableModification,
                        enableSuggestion: this.enableSuggestion
                    },
                    resultTemplateOptions: {
                        enableResultTemplate: this.enableResultTypes
                    }
                }
            ]
        };

        // External Items
        if (this.entityTypes.indexOf(EntityType.ExternalItem) !== -1 && this.connectionIds?.length > 0) {
            this.searchQuery.requests[0].contentSources = this.connectionIds;
        }

        // Sort properties
        if (this.sortProperties && this.sortProperties.length > 0) {
            this.searchQuery.requests[0].sortProperties = this.sortProperties;
        }

        // If a filter component is connected, get the configuration directly from connected component
        if (this.searchFiltersComponentId) {
            this.searchQuery.requests[0].aggregations = this.buildAggregationsFromFiltersConfig();
        }
    }
    
    //#endregion

    //#region Event handlers from connected components

    private async handleSearchFilters(e: CustomEvent<ISearchFiltersEventData>): Promise<void> {

        if (this.shouldRender) {

            let aggregationFilters: string[] = [];

            const selectedFilters = e.detail.selectedFilters;
           
            // Build aggregation filters
            if (selectedFilters.some(f => f.values.length > 0)) {

                // Bind to current context to be able to reference "dayJs"
                const buildFqlRefinementString = DataFilterHelper.buildFqlRefinementString.bind(this);
                
                // Make sure, if we have multiple filters, at least two filters have values to avoid apply an operator ("or","and") on only one condition failing the query.
                if (selectedFilters.length > 1 && selectedFilters.filter(selectedFilter => selectedFilter.values.length > 0).length > 1) {

                    const refinementString = buildFqlRefinementString(selectedFilters).join(",");
                    if (!isEmpty(refinementString)) {
                        aggregationFilters = aggregationFilters.concat([`${e.detail.filterOperator}(${refinementString})`]);
                    }

                } else {
                    aggregationFilters = aggregationFilters.concat(buildFqlRefinementString(selectedFilters));
                }

            } else {
                delete this.searchQuery.requests[0].aggregationFilters;
            }

            if (aggregationFilters.length > 0) {
                this.searchQuery.requests[0].aggregationFilters = aggregationFilters;
            }

            this.resetPagination();

            this.searchQuery.requests[0].aggregations = this.buildAggregationsFromFiltersConfig();

            await this._search(this.searchQuery);
        }
    }

    private async handleSearchInput(e: CustomEvent<ISearchInputEventData>): Promise<void> {
        
        if (this.shouldRender) {

            // Remove any query string parameter if used as default
            if (this.defaultQueryStringParameter) {
                
                const url = UrlHelper.removeQueryStringParam(this.defaultQueryStringParameter, window.location.href);
                if (url !== window.location.href) {
                    window.history.pushState({}, "", url);
                }               
            }
            
            // If empty keywords, reset to the default state
            const searchKeywords = !isEmpty(e.detail.keywords) ? e.detail.keywords : this.getDefaultQueryText();
            
            if (searchKeywords && searchKeywords !== this.searchQuery.requests[0].query.queryString) {

                // Update token
                this.tokenService.setTokenValue(BuiltinTokenNames.searchTerms, searchKeywords);

                this.searchQuery.requests[0].query.queryString = searchKeywords;
                this.searchQuery.requests[0].query.queryTemplate = this.tokenService.resolveTokens(this.queryTemplate);

                this.resetFilters();
                this.resetPagination();
    
                await this._search(this.searchQuery);
            } 
        }
    }

    /**
     * Handler when a new vertical is selected
     * @param e the selected vertical information
     */
    private async handleSearchVertical(e: CustomEvent<ISearchVerticalEventData>): Promise<void> {

        this.shouldRender = this.selectedVerticalKeys.indexOf(e.detail.selectedVertical.key) !== -1;
        this.tokenService.setTokenValue(BuiltinTokenNames.verticals, e.detail.selectedVertical);

        if (e.detail.eventType === ComponentEventType.UserActionEvent) {

            if (this.shouldRender) {

                // Reinitialize search context
                this.resetQueryText();
                this.resetFilters();
                this.resetPagination();
                this.initSortProperties();
    
                this.buildSearchQuery();
    
                // Update the query when the new tab is selected
                await this._search(this.searchQuery);
    
            } else {
    
                // If a query is currently performed, we cancel it to avoid new filters getting populated once one an other tab 
                if (this.isLoading) {
                    this.msSearchService.abortRequest();
                    this.searchResultsHelper.abortRequest();
                }
                
                // Reset available filters for connected search filter components
                this.fireCustomEvent(EventConstants.SEARCH_RESULTS_EVENT, {
                    availableFilters: []
                } as ISearchResultsEventData);
            }
        }

    }

    private async handleSearchSort(e: CustomEvent<ISearchSortEventData>): Promise<void> {
     
        if (this.shouldRender) {
            this.sortProperties = e.detail.sortProperties;

            this.buildSearchQuery();

            // Update the query when new sort is defined
            await this._search(this.searchQuery);
        }
    }

    //#endregion

    //#region Binding definitions

    private getSearchInputBinding(id: string): IComponentBinding {
        return {
            id: id,
            eventName: EventConstants.SEARCH_INPUT_EVENT,
            callbackFunction: this.handleSearchInput
        };
    }

    private getSearchVerticalsBinding(id: string): IComponentBinding {
        return {
            id: id,
            eventName: EventConstants.SEARCH_VERTICAL_EVENT,
            callbackFunction: this.handleSearchVertical
        };
    }
   

    private getSearchSortBinding(id: string) {
        return {
            id: id,
            eventName: EventConstants.SEARCH_SORT_EVENT,
            callbackFunction: this.handleSearchSort
        };
    }

    private getSearchFiltersBinding(id: string) {
        return {
            id: id,
            eventName: EventConstants.SEARCH_FILTER_EVENT,
            callbackFunction: this.handleSearchFilters
        };
    }

    //#endregion

    //#region Utility methods
    
    private getDefaultQueryText(): string {

        // 1) Look connected search box if any
        const inputComponent = document.getElementById(this.searchInputComponentId) as SearchInputComponent;
        if (inputComponent && inputComponent.searchKeywords) {
            return inputComponent.searchKeywords;
        }

        // 2) Look query string parameters if any
        if (this.defaultQueryStringParameter && !isEmpty(UrlHelper.getQueryStringParam(this.defaultQueryStringParameter, window.location.href))) {
            return UrlHelper.getQueryStringParam(this.defaultQueryStringParameter, window.location.href);
        }

        // 3) Look default hard coded value if any
        if (this.defaultQueryText) {
            return this.defaultQueryText;
        }
    }

    private goToPage(pageNumber: number) {

        if (pageNumber > 0) {

            // "-1" is to calculate the correct index. Ex page "1" with page size "10" means items from start index 0 to index 10.
            this.searchQuery.requests[0].from = (pageNumber - 1) * this.pageSize;
            this._search(this.searchQuery);
        }
    }

    private resetPagination() {
        
        // Reset to first page
        this.searchQuery.requests[0].from = 0;
        const paginationComponent = this.renderRoot.querySelector<PaginationComponent>(ComponentElements.PaginationComponent);
        if (paginationComponent) {
            paginationComponent.initPagination();
        }
    }

    private resetFilters() {

        // Reset existing filters if any selected
        if (this.searchFiltersComponentId) {
            const filterComponent = document.getElementById(this.searchFiltersComponentId) as SearchFiltersComponent;
            if (filterComponent) {
                filterComponent.clearAllSelectedValues(true);
            }
        }

        delete this.searchQuery.requests[0].aggregationFilters;
    }

    private initSortProperties() {

        this.sortProperties = this.sortFieldsConfiguration.filter(s=> s.isDefaultSort).map(s => {
            return {
                isDescending: s.sortDirection === SortFieldDirection.Descending,
                name: s.sortField 
            };
        });
    }

    private initVerticalSelectedKeys() {

        if (this.searchVerticalsComponentId) {
                
            // Check if the current component should be displayed at first
            const verticalsComponent = document.getElementById(this.searchVerticalsComponentId) as SearchVerticalsComponent;
            if (verticalsComponent) {

                // Read the default value directly from the attribute
                const selectedVerticalKey = verticalsComponent.selectedVerticalKey;

                if (selectedVerticalKey) {
                    this.tokenService.setTokenValue(BuiltinTokenNames.verticals, verticalsComponent.selectedVertical);
                    this.shouldRender = this.selectedVerticalKeys.indexOf(selectedVerticalKey) !== -1;
                }
            }

        } else {
            this.shouldRender = true;
        }
    }

    private resetQueryText() {
        const queryText = this.getDefaultQueryText();
        this.searchQuery.requests[0].query.queryString = queryText;        
    }

    /**
     * Gets default resource icon
     *
     * @param resource
     */
    private getResourceIcon(resource: SearchResource) {
        switch (resource["@odata.type"]) {
        case "#microsoft.graph.site":
            return getSvg(SvgIcon.Globe);
        case "#microsoft.graph.message":
            return getSvg(SvgIcon.Email);
        case "#microsoft.graph.event":
            return getSvg(SvgIcon.Event);
        case "microsoft.graph.chatMessage":
            return getSvg(SvgIcon.SmallChat);
        default:
            return getSvg(SvgIcon.FileOuter);
        }
    }

    /**
     * Gets default resource URLs
     *
     * @param resource
     */
    private getResourceUrl(resource: SearchResource) {
        return resource.webUrl || /* resource.url ||*/ resource.webLink || null;
    }

    /**
     * Gets default resource Names
     *
     * @param resource
     */
    private getResourceName(resource: SearchResource) {
        return resource.displayName || resource.subject || resource.name;
    }

    /**
     * Gets default result summary
     *
     * @param resource
     */
    private getResultSummary(result: SearchHit) {
        return sanitizeSummary(result.summary || (result.resource as SearchResource)?.description || null);
    }

    //#endregion
}
