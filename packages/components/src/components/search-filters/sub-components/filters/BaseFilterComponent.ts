import { html, TemplateResult, PropertyValues, PropertyValueMap } from "lit";
import { property, state } from "lit/decorators.js";
import { IDataFilterResult, IDataFilterResultValue, IDataFilterValue } from "../../../../models/common/IDataFilter";
import { FilterSortDirection, FilterSortType, IDataFilterConfiguration } from "../../../../models/common/IDataFilterConfiguration";
import { BaseComponent } from "../../../BaseComponent";
import { cloneDeep, isEqual, orderBy, sumBy } from "lodash-es";
import { ThemeInternalCSSVariables } from "../../../../common/Constants";
import { SearchSvgIcon, getInternalSvg } from "../../../../helpers/SearchSvgHelper";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { fillColor, SwatchRGB } from "@microsoft/fast-components";

export enum BaseFilterTemplates  {
    FilterName = "filter-name"
};

export enum DateFilterKeys {
    From = "from",
    To = "to"
}

export abstract class BaseFilterComponent extends BaseComponent {

    /**
     * Filter information to display
     */
    @property({attribute: false})
    filter: IDataFilterResult;

    /**
     * Filter confguration
     */
    @property({attribute: false})
    filterConfiguration: IDataFilterConfiguration;

    /**
     * Flag indicating if the filter should be disabled
     */
    @property({attribute: false})
    disabled: boolean;

    /**
     * Callback function when a filter is selected
     */
    @property()
    onFilterUpdated: (filterName: string, filterValue: IDataFilterValue, selected: boolean) => void;

    /**
     * Callback function when filters are submitted
     */
    @property()
    onApplyFilters: (filterName: string) => void;

    @state()
    isExpanded: boolean;

    /**
     * The current selected values in the component
     */
    @state()
    selectedValues: IDataFilterValue[] = [];

    /**
     * The submitted filter values
     */
    declare public submittedFilterValues: IDataFilterValue[];

    protected get localizedFilterName(): string {
        return this.getLocalizedString(this.filterConfiguration.displayName);
    }

    /**
     * Flag indicating if the selected values can be applied as filters
     */
    protected get canApplyValues(): boolean {
        return !isEqual(this.submittedFilterValues.map(v => v.value).sort(), this.selectedValues.map(v => v.value).sort());
    }

    public constructor() {
        super();

        this.submittedFilterValues = [];

        this.onItemUpdated = this.onItemUpdated.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.blurMenu = this.blurMenu.bind(this);
    }

    public override render() {

        const renderFilterNameTemplate = (filterName: string) => {

            if (this.hasTemplate(BaseFilterTemplates.FilterName)) {
                return html`${this.renderTemplate(BaseFilterTemplates.FilterName, { name: filterName, submittedValues: this.submittedFilterValues }, this.localizedFilterName)}`;
            }

            return html`${filterName}`;
        };

        let renderFilterName =  html`<span data-ref-name=${this.localizedFilterName}>${renderFilterNameTemplate(this.localizedFilterName)}</span>`;

        if (this.submittedFilterValues.length === 1) {
            renderFilterName = html`<span class="font-bold">${renderFilterNameTemplate(this.submittedFilterValues[0].name)}</span>`;
        }

        if (this.submittedFilterValues.length > 1) {

            // Display only filter values submitted and present in the available filter values
            // Multiple refinement steps can lead initial selected values to not be included in the available values 
            const selectedValues = this.submittedFilterValues.filter(s => {
                return this.processAggregations(this.filter.values).map(v => v.key).indexOf(s.key) !== -1 || s.key === DateFilterKeys.From || s.key === DateFilterKeys.To;
            });

            renderFilterName = html`
                <div class="flex items-center space-x-2">
                    <div class="font-bold">${this.localizedFilterName}</div>
                    <fast-badge class="rounded-[50%] flex items-center justify-center w-[22px] h-[22px] bg-primary font-bold text-white" fill="primary" color="white">${selectedValues.length}</fast-badge>
                </div>
            `;
        }

        return html`
                <div class=${this.theme}>
                    <fast-button  
                        id="filter-anchor"
                        class=${`relative flex items-center font-sans dark:hover:text-black dark:text-textColorDark ${this.disabled ? "opacity-75 pointer-events-none" : ""} ${this.theme}`}
                        size="xsmall" 
                        @click=${this.toggleMenu}
                        @blur=${this.blurMenu}
                        ?disabled=${this.disabled}
                    >
                        <div class="flex items-center space-x-2">
                            ${renderFilterName}
                            ${this.isExpanded && !this.disabled ?
                                html`<div class="text-primary w-3">${getInternalSvg(SearchSvgIcon.ArrowUp)}</div>`
                                :
                                html`<div class="text-primary w-3">${getInternalSvg(SearchSvgIcon.ArrowDown)}</div>`
                            }
                        </div>                      
                    </fast-button>
                   
                    <fast-anchored-region                             
                        class=${`${this.isExpanded ? "visible " : "invisible"} z-10`}
                        .anchorElement=${this.renderRoot.querySelector("[id='filter-anchor'")}
                        @mousedown=${(e: Event) => {
                            e.preventDefault();
                        }}
                        @click=${(e: Event) => {
                            // Avoid to dismiss the filter content when a value is selected or a button clicked
                            e.stopPropagation();
                        }}
                    >
                        ${this.renderFilterContent()}
                    </fast-anchored-region>
                </div>
                `;
    }

    protected override firstUpdated(changedProperties: PropertyValues<this>): void {

        // Set the element id to uniquely identify it in the DOM
        this.id = this.filter.filterName;
        
        super.firstUpdated(changedProperties);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected override updated(changedProperties: PropertyValueMap<any>): void {

        if (this.getTheme().isDarkMode) {
            fillColor.setValueFor(this.renderRoot.querySelector("fast-menu"), SwatchRGB.from(parseColorHexRGB(getComputedStyle(this).getPropertyValue(ThemeInternalCSSVariables.primaryBackgroundColorDark))));
        }

        super.updated(changedProperties);
    }

    /**
     * Reset all selected values for the current filter in the UI.
     * Can be called from parent components
     */
    protected resetSelectedValues() {

        // Update parent state
        this.selectedValues.forEach(v => {
            this.onFilterUpdated(this.filter.filterName, v, false);
        });

        // Reset internal state
        let newValues = [...this.selectedValues];
        newValues = [];

        this.selectedValues = newValues;
    }

    /**
     * Clear all selected values in the UI and submit empty filters to connected components
     * @param preventApply Set true if you want to prevent new values to be submitted for that filter
     */
    public clearSelectedValues(preventApply?: boolean) {

        this.resetSelectedValues();

        if (this.submittedFilterValues.length > 0) {

            // Reset submitted filters
            this.submittedFilterValues = [];

            if (!preventApply)
                this.applyFilters();
        } 
    }

    protected onItemUpdated(filterValue: IDataFilterValue, selected: boolean) {

        if (selected) {

            // Get the index of the filter value in the current selected values collection
            const valueIdx = this.selectedValues.map(value => value.key).indexOf(filterValue.key);
            const newValues = [...this.selectedValues];

            if (valueIdx !== -1 ) {

                // Update the existing value
                newValues[valueIdx] = filterValue;
            
            } else {

                // Add the new value if doesn't exist
                newValues.push(filterValue);
            }

            this.selectedValues = newValues;

        } else {
            this.selectedValues = this.selectedValues.filter(v => v.key !== filterValue.key);
        }

        this.onFilterUpdated(this.filter.filterName, filterValue, selected);
    }

    protected isSelectedValue(key: string): boolean {

        const isSelected = this.selectedValues.filter((v) => {
            return v.key === key;
        }).length > 0;

        return isSelected;
    }

    /**
     * The filter content to be implemented by concrete classes
     */
    protected abstract renderFilterContent(): TemplateResult;

    protected applyFilters(): void {   
        this.submittedFilterValues = cloneDeep(this.selectedValues);
        this.onApplyFilters(this.filter.filterName);
        this.closeMenu();
    }
    
    /**
     * Process manual filter aggregations according to matched values from configuration
     * @param values the original filter values received from the results
     * @returns the new aggregated filters values
     */
    protected processAggregations(values: IDataFilterResultValue[]): IDataFilterResultValue[] {

        let filteredValues = cloneDeep(values);

        if (this.filterConfiguration.aggregations) {

            this.filterConfiguration.aggregations.forEach(aggregation => {

                // Get all matching values 
                const matchingValues = filteredValues.filter(value => {
                    return aggregation.matchingValues.indexOf(value.name) > -1;
                });

                // Remove all values matching the aggregation
                filteredValues = filteredValues.filter(value => {
                    return aggregation.matchingValues.indexOf(value.name) === -1;
                });

                if (matchingValues.length > 0) {

                    // A new aggregation
                    filteredValues.push({
                        count: sumBy(matchingValues, "count"),
                        key: this.getLocalizedString(aggregation.aggregationName),
                        name: this.getLocalizedString(aggregation.aggregationName),
                        value: aggregation.aggregationValue
                    });
                }
            });
        }

        // Sort values according to the filter configuration        
        const sortProperty =  this.filterConfiguration.sortBy === FilterSortType.ByCount ? "count" : "name";
        const sortDirection = this.filterConfiguration.sortDirection === FilterSortDirection.Ascending ? "asc" : "desc";
        filteredValues = orderBy(filteredValues, sortProperty, sortDirection);

        return filteredValues;
    }
    
    // Close filter menu
    public closeMenu() {
      
        if (this.selectedValues.length > 0 && this.submittedFilterValues.length === 0) {
            this.resetSelectedValues();
        }

        this.isExpanded = false;
    }

    public toggleMenu() {
        this.isExpanded = !this.isExpanded;
    }

    protected blurMenu(e: MouseEvent) {

        // Don't close the filter panel if clicks come from an inner element
        if (!e.relatedTarget || !(e?.relatedTarget as HTMLElement).closest("fast-anchored-region")){
            this.isExpanded = false; 
        }
    }
}