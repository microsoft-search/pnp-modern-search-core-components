import { html, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { BaseFilterComponent } from "../BaseFilterComponent";
import { cloneDeep } from "lodash-es";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { IDataFilterResultValue } from "../../../../../models/common/IDataFilter";
import { FilterCheckboxStrings as strings } from "../../../../../loc/strings.default";
import { repeat } from "lit/directives/repeat.js";
import { IDataFilterAggregation } from "../../../../../models/common/IDataFilterConfiguration";
import { getInternalSvg, SearchSvgIcon } from "../../../../../helpers/SearchSvgHelper";
import { getSvg, SvgIcon } from "@microsoft/mgt-components/dist/es6/utils/SvgHelper";

export enum CheckBoxFilterTemplates  {
    FilterValue = "filter-value"
};

export class CheckboxFilterComponent extends BaseFilterComponent {

    @state()
    searchKeyword: string;

    /**
     * List of filtered values
    */
    @state()
    filteredValues: IDataFilterResultValue[] = [];

    declare startOffset: number;

    /**
     * Number of items to be displayed in the menu. Limit this number to increase performances
     */
    declare pageSize: number;

    static override get scopedElements() { 
        return super.scopedElements; 
    }

    constructor() {
        super();

        this.startOffset = 0;
        this.pageSize = 50;

        this.onScroll = this.onScroll.bind(this);

        this.addEventListener("templateRendered", (e: CustomEvent) => {

            if (e.detail.templateType === CheckBoxFilterTemplates.FilterValue) {

                const element = e.detail.element as HTMLElement;

                // Hightlight the content with current keywords where applicable
                element.querySelectorAll("[data-highlight]").forEach(elt => {
                    const textContent = elt.textContent;
                    elt.innerHTML = "";
                    elt.insertAdjacentHTML("afterbegin",this.highlightMatches(textContent));
                });
            }

        });
    }

    public override renderFilterContent() {

        // Display only filter values submitted and present in the available filter values
        // Multiple refinement steps can lead initial selected values to not be included in the available values 
        const selectedValues = this.submittedFilterValues.filter(s => {
            return this.filter.values.map(v => v.key).indexOf(s.key) !== -1;
        });

        const filterName = this.localizedFilterName ? this.localizedFilterName.toLowerCase() : null;

        const renderSearchBox = html`
            <div class="relative">
                ${
                    this.searchKeyword
                    ? html`
                      <div class="absolute top-[10px] right-[10px] text-black opacity-25" @click=${
                        this.clearSearchKeywords
                      }>${getSvg(SvgIcon.Close)}</div>`
                    : null
                }
            
                <fast-search 
                        id="searchbox"
                        autocomplete="off"
                        class="w-full outline-none bg-transparent p-0 border-0 focus:ring-offset-0 focus:ring-offset-inherit" 
                        type="text" 
                        placeholder=${this.strings.searchPlaceholder}
                        @click=${e => (e.target as HTMLInputElement).focus()}
                        @blur=${this.blurMenu}
                        @change=${e => {
                          this.filterValues(e.target.value);
                        }}
                        @input=${e => {
                          this.filterValues(e.target.value);
                        }}
                ></fast-search>
            </div>
        `;

        return html`
        
                <div class="sticky top-0 flex flex-col space-y-2 bg-white dark:bg-primaryBackgroundColorDark dark:text-textColorDark"> 
                    <div class="border-b px-6 py-3 space-y-2">                  
                        <label class="text-base">${this.filter.values.length} ${filterName}</label>
                        ${renderSearchBox}                        
                    </div>

                    <div class="flex justify-between items-center px-6 py-3 min-h-[48px]">

                        <div class="opacity-75"><label>${this.filteredValues.length} ${this.strings.selections}</label></div>
                        ${this.selectedValues.length > 0 || this.submittedFilterValues.length > 0 ? 
                            html`<fast-button appearance="stealth" data-ref="reset" type="reset"  @click=${() => this.clearSelectedValues()}>


                                    <div class="flex cursor-pointer space-x-1 items-center hover:text-primary opacity-75 dark:text-textColorDark">
                                        ${getInternalSvg(SearchSvgIcon.Refresh)}
                                        <span>${this.strings.reset}</span>
                                    </div>

                                </fast-button>` 
                            : null
                        }
                    </div>
                </div>
                <fast-menu 
                    id="filter-menu-content" 
                    class="p-2 rounded-none max-h-80 overflow-auto"
                >
                    ${repeat(
                        this.filteredValues,
                        filterValue => filterValue.key,
                        filterValue => {
                            return html`
                                    <fast-menu-item
                                        class="dark:text-textColorDark dark:hover:text-textColor mb-2 mt-2"
                                        @click=${(e: Event) => {
                                            // Use a mouse down event to not trigger the parent blur() event and close the panel before selecting a value
                                            e.preventDefault();
                                            this.onItemUpdated(filterValue, !this.isSelectedValue(filterValue.key));

                                            if (!this.filterConfiguration.isMulti) {
                                                this.applyFilters();
                                            }
                                        }}
                                        data-ref-count=${filterValue.count}
                                        data-ref-value=${filterValue.value}
                                        data-ref-name=${filterValue.name}
                                        role="menuitemcheckbox"
                                        ?checked=${this.isSelectedValue(filterValue.key)}
                                        ?ariaChecked=${this.isSelectedValue(filterValue.key)}
                                    >
                                        <div class="flex items-center space-x-3">
                                            <div class="flex items-center space-x-2">
                                                ${this.getFilterAggregation(filterValue.name)?.aggregationValueIconUrl ?
                                                
                                                    html`<img data-ref="icon" class="w-[24px]" src=${this.getFilterAggregation(filterValue.name).aggregationValueIconUrl}>`
                                                    : 
                                                    null
                                                }
                                                <div data-ref="value" class="font-medium ${this.isSelectedValue(filterValue.key) ? "text-primary" : ""}">
                                                    ${this.hasTemplate(CheckBoxFilterTemplates.FilterValue) ? 
                                                        this.renderTemplate(CheckBoxFilterTemplates.FilterValue, {...filterValue, keywords: this.searchKeyword, filterName: this.filter.filterName}, filterValue.key) : // Context object needs to be updated to trigger a new re-render of the template
                                                        html`${unsafeHTML(this.highlightMatches(filterValue.name))}` 
                                                    }
                                                </div>
                                            </div>
                                            
                                        </div>
                                        ${this.filterConfiguration.showCount ? 
                                            html`<div slot="end">
                                                    <label class="ml-3 opacity-75 ${this.isSelectedValue(filterValue.key) ? "dark:text-textColor" : ""}">(${filterValue.count})</label>
                                                </div>
                                            ` : null
                                        }
                                    </fast-menu-item>
                            `;
                        })
                    }
                </fast-menu>
                ${this.filterConfiguration.isMulti ?
                    html`
                        <div class="sticky bottom-0 flex justify-around py-2 px-2 space-x-4 bg-white dark:bg-primaryBackgroundColorDark  border-t border-gray-400 w-full border-opacity-25">
                            <fast-button data-ref="cancel" appearance="outline" class="text-textColor dark:text-textColorDark" @click=${this.closeMenu}>
                                ${this.strings.cancel}
                            </fast-button>
                            <fast-button data-ref="apply" appearance="accent" class="${this.selectedValues.length === 0 || !this.canApplyValues ? "opacity-50 cursor-not-allowed": ""}"
                                    ?disabled=${this.selectedValues.length === 0 || !this.canApplyValues}
                                    @click=${this.applyFilters}
                            >
                                ${this.strings.apply}
                            </fast-button>
                        </div>
                    `
                    :
                    null
                }
        `;
    }

    public override firstUpdated(changedProperties: PropertyValues<this>): void {

        // Return only a subset of values to manage performances
        this.filteredValues = this.processAggregations(this.filter.values).slice(0, this.pageSize);

        this.startOffset = this.pageSize;
    
        const elt = this.renderRoot.querySelector("#filter-menu-content");
        elt.addEventListener("scroll", this.onScroll);

        super.firstUpdated(changedProperties);
    }

    public override updated(changedProperties: PropertyValues<this>): void {

        if (changedProperties.get("filter")) {
            this.filteredValues = this.sortBySelectedValues(this.processAggregations(this.filter.values)).slice(0, this.pageSize);
        }

        super.updated(changedProperties);
    }

    public override disconnectedCallback(): void {
        
        const elt = this.renderRoot.querySelector("#filter-menu-content");
        elt.removeEventListener("scroll", this.onScroll);
        super.disconnectedCallback();
    } 

    protected override get strings(): { [x: string]: string; } {
        return strings;
    }

    public filterValues(value: string) {
        
        if (!value) {
            this.filteredValues = this.sortBySelectedValues(this.processAggregations(this.filter.values));
        } else {
            this.filteredValues = this.processAggregations(this.filter.values).filter(v => v.name.toLocaleLowerCase().indexOf(value) !== -1);
        }

        // Return only a subset of values to manage performances
        this.filteredValues = this.filteredValues.slice(0, this.pageSize);

        this.searchKeyword = value;
    }

    private sortBySelectedValues(filters: IDataFilterResultValue[]) {
        return filters.sort((x,y) => {
            return  Number(this.isSelectedValue(y.key)) - Number(this.isSelectedValue(x.key));
        });
    }

    private highlightMatches(value: string) {

        if (this.searchKeyword) {
            const matchExpr = value.replace(new RegExp(this.searchKeyword, "gi"), (match) => `<b class="text-primary opacity-50">${match}</b>`);
            return matchExpr;
        }

        return value;
    }

    private clearSearchKeywords() {
        (this.renderRoot.querySelector("#searchbox") as HTMLInputElement).value = null;
        this.filterValues(null);
    }

    private onScroll() {

        const elt = this.renderRoot.querySelector("#filter-menu-content");
        if (elt.scrollTop + elt.clientHeight >= (elt.scrollHeight - 50)) {
            const newOffset = this.startOffset + this.pageSize;
            this.filteredValues = this.processAggregations(this.filter.values).slice(0, newOffset);
            this.startOffset = newOffset;
        }
    }

    private getFilterAggregation(name: string): IDataFilterAggregation {
        
        return this.filterConfiguration.aggregations?.filter(aggregation => {
            return this.getLocalizedString(aggregation.aggregationName) === name;
        })[0];
    }
}