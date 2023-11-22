import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { EventConstants } from "../../common/Constants";
import { ISearchResultsEventData } from "../../models/events/ISearchResultsEventData";
import { BaseComponent } from "../BaseComponent";
import { SearchInfosStrings as strings } from "../../loc/strings.default";
import { SearchInputComponent } from "../search-input/SearchInputComponent";

export class SearchInfosComponents extends BaseComponent {

    @property({
        type: Array, attribute: "search-results-ids", converter: {
            fromAttribute: (value) => {
                return value.split(",");
            },
        }
    })
    searchResultsComponentIds: string[] = [];

    /**
     * The search input component ID if connected to a search input
     */
    @property({ type: String, attribute: "search-input-id" })
    searchInputComponentId: string;

    @state()
    searchResultsEventData: ISearchResultsEventData = {
        availableFilters: [],
        resultsCount: undefined,
        submittedQueryText: undefined
    };

    constructor() {
        super();

        this.handleSearchResultsInfos = this.handleSearchResultsInfos.bind(this);
    }

    public override render() {

        const { resultsCount, submittedQueryText, queryAlterationResponse } = this.searchResultsEventData;
        let renderSearchInfos;
        let renderDidYouMean;
    
        const renderShimmers = html`
            <div class="px-2.5 bg-[var(--gray200)] min-h-[176px] mb-8">
                <div class="max-w-7xl ml-auto mr-auto pt-12 pb-14">
                    <h2 class="h-9 w-96 animate-shimmer bg-slate-200 rounded mb-4"></h2>
                    <p class="h-5 w-40 animate-shimmer bg-slate-200 rounded text-sm"></p>
                </div>
            </div>
        `;

        if (!resultsCount && !submittedQueryText) {
            return renderShimmers;
        }

        if (resultsCount === 0 && submittedQueryText) {
            renderSearchInfos = strings.notFoundSuggestions(submittedQueryText);
        } else {
            renderSearchInfos = html`
                <h2 class="font-primary font-normal text-3xl pt-2 pb-2">${this.strings.searchQueryResultText(this.searchResultsEventData?.submittedQueryText)}</h2>
                <p class="text-sm pt-2 pb-2">${this.strings.resultCountText(resultsCount)}</p>
            `;
        }
        
        if (queryAlterationResponse && queryAlterationResponse?.queryAlteration) {

            const updatedString = queryAlterationResponse.queryAlteration.alteredHighlightedQueryString
                                  .replace(/\uE000(.+)\uE001/gi,
                                    (match) => `<b class="text-primary font-bold">
                                        ${match.replace(/\ue000|\ue001|\uE000\|\uE001/gi, "")}
                                    </b>`
                                  );
                                  
            const alteredQueryString = queryAlterationResponse.queryAlteration.alteredQueryString;

            const onSuggestionClicked = (e: Event) => {

                e.preventDefault();
                
                // Manually submit a new search of the connected search input component
                // This way, we don't care about connected search results and the update will be propagated accordingly
                const searchInputComponent = document.getElementById(this.searchInputComponentId) as SearchInputComponent;
                if (searchInputComponent) {
                    searchInputComponent.searchKeywords = alteredQueryString;
                    searchInputComponent.submitSearch();
                }

            };

            renderDidYouMean = html`
                <p class="text-sm pt-2 pb-2">${this.strings.didYouMean(onSuggestionClicked, updatedString)}</p>
            `;
        }

        if (submittedQueryText || resultsCount) {
            return html`
                <!-- Results found -->
                <div class="px-2.5 bg-[var(--gray200)] min-h-[176px] mb-8 ${this.theme}">
                    <div class="max-w-7xl ml-auto mr-auto pt-12 pb-14 dark:text-textColorDark">
                        ${renderSearchInfos}
                        ${renderDidYouMean}
                    </div>
                </div>
            `;
        }


        return null;
    }

    public override async connectedCallback(): Promise<void> {

        const bindings = this.searchResultsComponentIds.map(componentId => {
            return {
                id: componentId,
                eventName: EventConstants.SEARCH_RESULTS_EVENT,
                callbackFunction: this.handleSearchResultsInfos
            };
        });

        await this.bindComponents(bindings);

        return super.connectedCallback();
    }

    static override get styles() {
        return [
            BaseComponent.themeStyles, // Allow component to use theme CSS variables from design. The component is a first level component so it is OK to define them variables here
            BaseComponent.styles // Use base styles (i.e. Tailwind CSS classes)
        ];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected override get strings(): { [x: string]: any ; } {
        return strings;
    }

    private handleSearchResultsInfos(e: CustomEvent<ISearchResultsEventData>) {
        this.searchResultsEventData = e.detail;
    }
}