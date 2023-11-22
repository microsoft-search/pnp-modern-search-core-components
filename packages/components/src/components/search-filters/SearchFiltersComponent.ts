import { PropertyValues, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { cloneDeep, isEmpty, isEqual, sortBy } from "lodash-es";
import { ComponentElements, EventConstants } from "../../common/Constants";
import { CheckBoxFilterTemplates, CheckboxFilterComponent } from "./sub-components/filters/checkbox-filter/CheckboxFilterComponent";
import { DateFilterComponent } from "./sub-components/filters/date-filter/DateFilterComponent";
import { BuiltinFilterTemplates } from "../../models/common/BuiltinTemplate";
import { FilterConditionOperator, IDataFilter, IDataFilterResult, IDataFilterResultValue, IDataFilterValue } from "../../models/common/IDataFilter";
import { FilterSortDirection, FilterSortType, IDataFilterConfiguration } from "../../models/common/IDataFilterConfiguration";
import { ISearchFiltersEventData } from "../../models/events/ISearchFiltersEventData.ts";
import { ISearchResultsEventData } from "../../models/events/ISearchResultsEventData";
import { BaseFilterComponent, BaseFilterTemplates } from "./sub-components/filters/BaseFilterComponent";
import { SearchFiltersStrings as strings } from "../../loc/strings.default";
import { BaseComponent } from "../BaseComponent";
import { ISearchSortProperty } from "../../models/search/IMicrosoftSearchRequest";
import { SearchSortComponent } from "./sub-components/search-sort/SearchSortComponent";
import { ISearchSortEventData } from "../../models/events/ISearchSortEventData";
import { IComponentBinding } from "../../models/common/IComponentBinding";
import { ISearchVerticalEventData } from "../../models/events/ISearchVerticalEventData";
import { IDataVertical } from "../../models/common/IDataVertical";
import { SearchVerticalsComponent } from "../search-verticals/SearchVerticalsComponent";
import { SearchSvgIcon, getInternalSvg } from "../../helpers/SearchSvgHelper";
import { MonacoEditorComponent } from "../monaco-editor/MonacoEditorComponent";
import { TemplateHelper } from "../../helpers/TemplateHelper";
import { unsafeHTML } from "lit/directives/unsafe-html.js";


export class SearchFiltersComponent extends BaseComponent {

    /**
     * The connected search results component ids
     */
    @property({
        type: Array, attribute: "search-results-ids", converter: {
            fromAttribute: (value) => {
                return value ? value.split(","): [];
            },
        }
    })
    searchResultsComponentIds: string[] = [];

    /**
     * The search verticals component ID if connected to a search verticals
     */
    @property({ type: String, attribute: "search-verticals-id", reflect: true })
    searchVerticalsComponentId: string;

    /**
     * The filters configration
     */
    @property({
        type: Object, attribute: "settings", converter: {
            fromAttribute: (value) => {
                return JSON.parse(value) as IDataFilterConfiguration[];
            },
        }
    })
    filterConfiguration: IDataFilterConfiguration[] = [];

    /**
     * The default logical operator to use between filters
     */
    @property({ type: String, attribute: "operator" })
    operator: FilterConditionOperator = FilterConditionOperator.AND;

    /**
     * Available filters received from connected search results component
     */
    @state()
    availableFilters: IDataFilterResult[] = [];
   
    /**
     * All selected values from all filters combined (not necessarily submitted)
     */
    @state()
    allSelectedFilters: IDataFilter[] = [];

    @state()
    selectedVertical: IDataVertical;

    /**
     * The list of disabled filters
     */
    declare private disabledFilters: string[];

    /**
     * All submitted values from all filters combined
     */
    declare public allSubmittedFilters: IDataFilter[];

    /**
     * The previous applied filters
     */
    declare private previousAvailableFilters: IDataFilterResult[];

    /**
     * The current query submitted
     */
    declare public submittedQueryText: string;

    declare private searchResultsEventData: ISearchResultsEventData;

    static override get scopedElements() {
        return {
            ...super.scopedElements,
            "pnp-filter-checkbox": CheckboxFilterComponent,
            "pnp-filter-date": DateFilterComponent,
            "pnp-search-sort": SearchSortComponent,
            "pnp-monaco-editor": MonacoEditorComponent
        };
    }

    constructor() {
        super();

        this.allSelectedFilters = [];
        this.allSubmittedFilters = [];
        this.disabledFilters = [];

        this.handleSearchResultsFilters = this.handleSearchResultsFilters.bind(this);
        this.handleSearchVertical = this.handleSearchVertical.bind(this);
        this.onFilterUpdated = this.onFilterUpdated.bind(this);
        this.onApplyFilters = this.onApplyFilters.bind(this);
        this.onSort = this.onSort.bind(this);

        this.getSearchResultsBindings = this.getSearchResultsBindings.bind(this);
        this.getSearchVerticalsBinding = this.getSearchVerticalsBinding.bind(this);
       
    }

    public override render() {

        let renderSort = null;
        let renderFilterValueTemplate = null;
        let renderFilterNameTemplate = null;

        if (this.hasTemplate(CheckBoxFilterTemplates.FilterValue)) {
            // TODO: Find a way to trigger update for sub components using this template
            renderFilterValueTemplate = html`${unsafeHTML(TemplateHelper.normalizeHtmlTemplate(this.templates[CheckBoxFilterTemplates.FilterValue]))}`;
        }

        if (this.hasTemplate(BaseFilterTemplates.FilterName)) {
            renderFilterNameTemplate = html`${unsafeHTML(TemplateHelper.normalizeHtmlTemplate(this.templates[BaseFilterTemplates.FilterName]))}`;
        }

        const renderCheckbox = (availableFilter: IDataFilterResult) => {
            return html`<pnp-filter-checkbox
                            class="cursor-pointer"
                            data-ref-name=${availableFilter.filterName}
                            .disabled=${this.disabledFilters.indexOf(availableFilter.filterName) > -1}
                            .filter=${availableFilter}
                            .filterConfiguration=${this.filterConfiguration.filter(c => c.filterName === availableFilter.filterName)[0]}
                            .onFilterUpdated=${this.onFilterUpdated}
                            .onApplyFilters=${this.onApplyFilters}
                            .theme=${this.theme}
                        >
                            ${renderFilterValueTemplate}
                            ${renderFilterNameTemplate}
                        </pnp-filter-checkbox>`;
        };

        const renderDate = (availableFilter: IDataFilterResult) => {
            return html`<pnp-filter-date
                            class="cursor-pointer"
                            data-ref-name=${availableFilter.filterName}
                            .disabled=${this.disabledFilters.indexOf(availableFilter.filterName) > -1}
                            .filter=${availableFilter}
                            .filterConfiguration=${this.filterConfiguration.filter(c => c.filterName === availableFilter.filterName)[0]}
                            .onFilterUpdated=${this.onFilterUpdated}
                            .onApplyFilters=${this.onApplyFilters}
                            .theme=${this.theme}
                        >
                            ${renderFilterNameTemplate}
                        </pnp-filter-date>`;
        };

        const renderShimmers = html`
            <div class=${`flex grid-rows-${this.filterConfiguration.length} grid-flow-col gap-2 flex-wrap`}>
                ${repeat(
                    this.filterConfiguration.filter(c => {
                        let shouldRenderFilter = true;
                        if (this.searchVerticalsComponentId && c?.verticalKeys?.indexOf(this.selectedVertical?.key) === -1) {
                            shouldRenderFilter = false;
                        }

                        return shouldRenderFilter;
                    }),
                    configuration => configuration.filterName,
                    (configuration) => {

                        let shouldRenderFilter = true;
                        if (this.searchVerticalsComponentId && configuration.verticalKeys?.indexOf(this.selectedVertical.key) === -1) {
                            shouldRenderFilter = false;
                        }

                        if (shouldRenderFilter) {
                            return html`<div data-ref="shimmer" data-ref-name=${configuration.filterName} class="h-3 w-14 animate-shimmer bg-slate-200 rounded"></div>`;
                        } else {
                            return nothing;
                        }                        
                    }
                )
                }
            </div>
        `;

        if (this.searchResultsEventData?.sortFieldsConfiguration && this.availableFilters.length > 0) {

            renderSort = html`
                <pnp-search-sort
                    .sortProperties=${this.searchResultsEventData.sortFieldsConfiguration}
                    .onSort=${this.onSort}
                    .theme=${this.theme}
                >
                </pnp-search-sort>
            `;
        }
        
        let renderFilters = html`${repeat(
            // https://lit.dev/docs/templates/lists/#when-to-use-map-or-repeat
            this.availableFilters,
            (filter) => filter.filterName,
            (availableFilter) => {

                // Only display the filter component is values are present
                if (availableFilter.values.length > 0) {

                    // Determine the visibility of the filter if connected to a verticals
                    const filterConfiguration = this.getFilterConfiguration(availableFilter.filterName);
                    let shouldRenderFilter = true;
                    if (this.searchVerticalsComponentId && filterConfiguration.verticalKeys?.indexOf(this.selectedVertical?.key) === -1) {
                        shouldRenderFilter = false;
                    }

                    // Can be null if the filter name has been changed 
                    if  (filterConfiguration && shouldRenderFilter) {

                        switch (filterConfiguration.template) {
                            case BuiltinFilterTemplates.CheckBox:
                                return renderCheckbox(availableFilter);
    
                            case BuiltinFilterTemplates.Date:
                                return renderDate(availableFilter);
    
                            default:
                                return renderCheckbox(availableFilter);
                        }
                    }
  
                } else {
                    return nothing;
                }
            }
        )}`;

        if (this.availableFilters.length === 0 && this.filterConfiguration.length > 0) {

            if (this.searchResultsComponentIds?.length > 0 && isEmpty(this.submittedQueryText)) {
                renderFilters = renderShimmers;
            } else {
                renderFilters = html`<span class="dark:text-textColorDark">${this.strings.noFilters}</span>`;
            }
        }

        let renderContent = html`
            <div class=${this.theme}>
                <div class="font-sans text-sm flex p-4 dark:bg-primaryBackgroundColorDark justify-between">
                    <div class="flex items-center space-x-2">
                        <div class="dark:text-textColorDark">${getInternalSvg(SearchSvgIcon.Filter)}</div>
                        <div class=${`flex grid-rows-${this.availableFilters.length} grid-flow-col flex-wrap gap-2`}>
                            ${renderFilters}
                            ${(this.availableFilters.length > 0 && this.allSelectedFilters.length > 0) || this.allSubmittedFilters.length > 0 ?
                                html`<button data-ref="reset" class="flex cursor-pointer space-x-1 items-center hover:text-primary  dark:text-textColorDark opacity-75" @click=${() => { this.clearAllSelectedValues(); }}>
                                        <i class="dark:text-textColorDark">${getInternalSvg(SearchSvgIcon.Refresh)}</i>
                                        <span>${this.strings.resetAllFilters}</span>
                                    </button>`
                                :
                                null
                            }
                        </div>
                    </div>
                    <div>
                        ${renderSort}
                    </div>
                </div>
            </div>
        `;

        if (this.showDebugData && this.enableDebugMode) {
            renderContent = this.renderDebugData(this.availableFilters);
        }

        return html`
            ${this.enableDebugMode ? this.renderDebugMode(): null}
            ${renderContent}
        `;
    }

    static override get styles() {
        return [
            BaseComponent.themeStyles, // Allow component to use them CSS variables from design. The component is a first level component so it is OK to define theme variables here
            BaseComponent.styles // Use base styles (i.e. Tailwind CSS classes)
        ];
    }

    protected override get strings(): { [x: string]: string; } {
        return strings;
    }

    public override async connectedCallback(): Promise<void> {

        const bindings = this.getSearchResultsBindings(this.searchResultsComponentIds).concat(this.getSearchVerticalsBinding([this.searchVerticalsComponentId]));
        
        await this.bindComponents(bindings);

        // Determine the current selected vertical key if any verticals component is connected
        this.initVerticalSelectedKeys();

        return super.connectedCallback();
    }

    public override async updated(changedProperties: PropertyValues<this>): Promise<void> {

        // Updated bindings
        if (changedProperties.has("searchResultsComponentIds")) {
            await this.updateBinding(EventConstants.SEARCH_RESULTS_EVENT, this.searchResultsComponentIds, changedProperties.get("searchResultsComponentIds"));
        }

        // Updated bindings
        if (changedProperties.has("searchVerticalsComponentId")) {
            await this.updateBinding(EventConstants.SEARCH_VERTICAL_EVENT, this.searchVerticalsComponentId ? [this.searchVerticalsComponentId] : [], changedProperties.get("searchVerticalsComponentId"));
            this.initVerticalSelectedKeys();
        }

        // Notify connected search results filters have been reset due to configuration update
        if (this.hasPropertyUpdated(changedProperties,"filterConfiguration") || 
            this.hasPropertyUpdated(changedProperties,"operator")) {

            // Reset the selected filter values as configuration has changed so not relevant anymore
            this.fireCustomEvent(EventConstants.SEARCH_FILTER_EVENT, {
                selectedFilters: [],
                filterOperator: this.operator ? this.operator : FilterConditionOperator.AND
            } as ISearchFiltersEventData);
        }
    }
    
    public handleSearchResultsFilters(e: CustomEvent<ISearchResultsEventData>) {
        
        this.searchResultsEventData = e.detail;
        this.availableFilters = cloneDeep(e.detail.availableFilters);
        this.submittedQueryText = e.detail.submittedQueryText;

        // Handle filters with zero value
        if (e.detail.availableFilters.length === 0 && this.allSelectedFilters.length > 0) {

            // Existing selected filters 
            const selectedFilterNames = this.allSelectedFilters.map(filter => filter.filterName);

            this.availableFilters = cloneDeep(this.previousAvailableFilters.map(f => {
                f.values = [];
                return f;
            }));

            // Disable non selected filters
            this.previousAvailableFilters.forEach(p => {

                if (selectedFilterNames.indexOf(p.filterName) === -1) {
                    this.disabledFilters.push(p.filterName);
                }
            });

        } else {
            this.disabledFilters = [];
        }

        // Merge filters with the same field name
        // This scenario happens when multiple sources have the same alias as refiner. In this case, the API returns duplicate fields instead of merging them.
        this.availableFilters = this.mergeFilters(this.availableFilters);

        // Sort filters by configuration if any
        this.availableFilters = this.availableFilters.sort((a, b) => {
            const aSortIdx = this.filterConfiguration.filter(f => f.filterName === a.filterName)[0].sortIdx;
            const bSortIdx = this.filterConfiguration.filter(f => f.filterName === b.filterName)[0].sortIdx;
            return aSortIdx - bSortIdx;
        });

        // Save available filters for subsequent usage
        this.previousAvailableFilters = cloneDeep(this.availableFilters);
    }

    private async handleSearchVertical(e: CustomEvent<ISearchVerticalEventData>): Promise<void> {
        
        this.selectedVertical = cloneDeep(e.detail.selectedVertical);

        // To display shimmers when changing tab when connected to search results
        this.availableFilters = [];
        this.submittedQueryText = undefined; 
    }

    private initVerticalSelectedKeys() {

        if (this.searchVerticalsComponentId) {
                
            // Check if the current component should be displayed at first
            const verticalsComponent = document.getElementById(this.searchVerticalsComponentId) as SearchVerticalsComponent;
            if (verticalsComponent) {
                // Read the default value directly from the attribute
                this.selectedVertical = cloneDeep(verticalsComponent.selectedVertical);
            }

        }
    }

    /**
     * Handler when a value is updated (selected/unselected)from a specific filter
     * @param filterName the filter name from where values has been applied
     * @param filterValue the filter value that has been updated
     */
    private onFilterUpdated(filterName: string, filterValue: IDataFilterValue, selected: boolean) {

        if (selected) {

            // Get the index of the filter in the current selected filters collection
            const filterIdx = this.allSelectedFilters.map(filter => { return filter.filterName; }).indexOf(filterName);
            const newFilters = [...this.allSelectedFilters];

            if (filterIdx !== -1) {

                const valueIdx = this.allSelectedFilters[filterIdx].values.map(v => v.key).indexOf(filterValue.key);

                if (valueIdx === -1) {
                    // If the value does not exist yet, we add it to the selected values

                    newFilters[filterIdx].values.push(filterValue);
                    this.allSelectedFilters = newFilters;

                } else {

                    // Otherwise, we update the value in selected values
                    newFilters[filterIdx].values[valueIdx] = filterValue;
                }

            } else {

                const newFilter: IDataFilter = {
                    filterName: filterName,
                    values: [
                        filterValue
                    ]
                };

                newFilters.push(newFilter);
            }

            this.allSelectedFilters = newFilters;

        } else {

            // Remove the filter value
            this.allSelectedFilters = this.allSelectedFilters.map(selectedFilter => {

                selectedFilter.values = selectedFilter.values.filter(value => value.key != filterValue.key);

                if (selectedFilter.values.length > 0) {
                    return selectedFilter;
                } else {
                    return null;
                }
            });

            // Remove null values
            this.allSelectedFilters = this.allSelectedFilters.filter(f => f);
        }
    }

    /**
     * Handler when values are applied from a specific filter
     * @param filterName the filter name from where values has been applied
     */
    private onApplyFilters(filterName: string) {

        // Update the list of submitted filters to sent to the search engine
        const selectedFilter = this.allSelectedFilters.filter(f => f.filterName === filterName)[0];

        // If filter is 'null', it means no values are currently selected for that filter 
        if (selectedFilter) {

            const filterIdx = this.allSubmittedFilters.map(filter => { return filter.filterName; }).indexOf(filterName);
            const newFilters = [...this.allSubmittedFilters];

            if (filterIdx === -1) {
                newFilters.push(selectedFilter);
            } else {
                newFilters[filterIdx] = selectedFilter;
            }

            this.allSubmittedFilters = newFilters;

        } else {
            this.allSubmittedFilters = this.allSubmittedFilters.filter(s => s.filterName !== filterName);
        }

        // Reset selected values from other filters that are not already submitted
        const otherFiltersWithSelectedValues = this.allSelectedFilters.filter(f => {
            return f.filterName !== filterName && this.allSubmittedFilters.filter(a => a.filterName === f.filterName).length === 0;
        }).map(f => f.filterName);

        otherFiltersWithSelectedValues.forEach(filterName => {
            const filterComponent = this.getFilterComponents(filterName);
            if (filterComponent) {
                filterComponent[0].clearSelectedValues(true);
            }
        });

        this.applyFilters();
    }

    /**
     * Handler when sort properties are updated
     * @param sortProperties the sort properties
     */
    private onSort(sortProperties: ISearchSortProperty[]) {
        this.fireCustomEvent(
            EventConstants.SEARCH_SORT_EVENT, 
            {
                sortProperties: sortProperties
            } as ISearchSortEventData, 
        true);    
    }
    
    /**
     * Send filters to connected search results component
     */
    private applyFilters() {

        // Update filters information before sending them to source so they can be processed according their specificities
        // i.e Merge selected filter with relavant information from its configuration
        const updatedFilters = this.allSubmittedFilters.map(f => {

            const confguration = this.getFilterConfiguration(f.filterName);
            if (confguration) {
                f.operator = confguration.operator;
            }
            return f;
        });

        this.fireCustomEvent(EventConstants.SEARCH_FILTER_EVENT, {
            selectedFilters: updatedFilters,
            filterOperator: this.operator ? this.operator : FilterConditionOperator.AND
        } as ISearchFiltersEventData);
    }

    private getFilterConfiguration(filterName: string): IDataFilterConfiguration {
        return this.filterConfiguration.filter(c => c.filterName === filterName)[0];
    }

    /**
     * Merges filter values having the same filter name
     * @param availableFilters the available filters returned from the search response
     * @returns the merged filters
     */
    private mergeFilters(availableFilters: IDataFilterResult[]): IDataFilterResult[] {

        let allMergedFilters: IDataFilterResult[] = [];

        availableFilters.forEach(filterResult => {

            const mergedFilterIdx = allMergedFilters.map(m => m.filterName).indexOf(filterResult.filterName);

            if (mergedFilterIdx === -1) {
                allMergedFilters.push(filterResult);
            } else {

                const allMergedValues: IDataFilterResultValue[] = [];
                const allValues = allMergedFilters[mergedFilterIdx].values.concat(filterResult.values);

                // 3. Sum counts for similar value names
                allValues.forEach(value => {

                    const mergedValueIdx = allMergedValues.map(v => v.name).indexOf(value.name);

                    if (mergedValueIdx === -1) {
                        allMergedValues.push(value);
                    } else {
                        allMergedValues[mergedValueIdx].count = allMergedValues[mergedValueIdx].count + value.count;
                    }
                });

                allMergedFilters[mergedFilterIdx].values = allMergedValues;
            }
        });

        // Sort values according to the filter configuration
        allMergedFilters = allMergedFilters.map(filter => {

            let sortByField = "name";
            let sortDirection = FilterSortDirection.Ascending;

            const filterConfigurationIdx = this.filterConfiguration.map(configuration => configuration.filterName).indexOf(filter.filterName);
            if (filterConfigurationIdx !== -1) {

                const filterConfiguration = this.filterConfiguration[filterConfigurationIdx];
                if (filterConfiguration.sortBy === FilterSortType.ByCount) {
                    sortByField = "count";
                }

                if (filterConfiguration.sortDirection === FilterSortDirection.Descending) {
                    sortDirection = FilterSortDirection.Descending;
                }
            }

            filter.values = sortDirection === FilterSortDirection.Ascending ? sortBy(filter.values, sortByField) : sortBy(filter.values, sortByField).reverse();

            return filter;
        });

        return allMergedFilters;
    }

    public clearAllSelectedValues(preventApply?: boolean) {

        // Reset selected values for all child components
        const filterComponents = this.getFilterComponents();

        // Reset all filters from the UI (whithout submitting values)
        filterComponents.forEach(component => component.clearSelectedValues(true));

        if (this.allSubmittedFilters.length > 0) {

            this.allSubmittedFilters = [];

            // Apply empty filters
            if (!preventApply) {
                this.applyFilters();
            }
        }
    }

    /**
     * Retrieved the list of child filters
     * @param filterName Optionnal. A specific filter name to retrieve
     * @returns the list of child filter components
     */
    private getFilterComponents(filterName?: string): BaseFilterComponent[] {

        // Reset all values from sub components. List all valid sub filter components
        const filterComponents: BaseFilterComponent[] = Array.prototype.slice.call(this.renderRoot.querySelectorAll<BaseFilterComponent>(`
            ${ComponentElements.DateFilterComponent},
            ${ComponentElements.CheckboxFilterComponent}
        `));

        return filterName ? filterComponents.filter(component => component.filter.filterName === filterName) : filterComponents;
    }
    
    private getSearchResultsBindings(ids: string[]): IComponentBinding[] {

        return ids.map(componentId => {
            return {
                id: componentId,
                eventName: EventConstants.SEARCH_RESULTS_EVENT,
                callbackFunction: this.handleSearchResultsFilters
            };
        });
    }

    private getSearchVerticalsBinding(ids: string[]): IComponentBinding[] {

        return ids.map(componentId => {
            return {
                id: componentId,
                eventName: EventConstants.SEARCH_VERTICAL_EVENT,
                callbackFunction: this.handleSearchVertical
            };
        });
    }

    private async updateBinding(event: EventConstants, newValue: string | string[], previousValue: string | string[]): Promise<void> {

        let bindingFunction;

        switch (event) {
            case EventConstants.SEARCH_RESULTS_EVENT:
                bindingFunction = this.getSearchResultsBindings;
                break;

            case EventConstants.SEARCH_VERTICAL_EVENT:
                bindingFunction = this.getSearchVerticalsBinding;
                break;

            default:
                throw new Error("Wrong event type");
        }

        // Unbind
        if (!isEmpty(previousValue) && !isEqual(newValue, previousValue)) {       
          this.unbindComponents(bindingFunction(previousValue));

          // Reset to default state as current filters are not valid anymore
          this.availableFilters = [];
        }

        // Bind 
        if (!isEmpty(newValue)) {
            await this.bindComponents(bindingFunction(newValue));
        }   
    }
}