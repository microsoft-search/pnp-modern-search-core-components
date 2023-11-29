import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { SearchSortStrings as strings } from "../../../../loc/strings.default";
import { BaseComponent } from "../../../BaseComponent";
import { repeat } from "lit/directives/repeat.js";
import { nothing } from "lit";
import { ISortFieldConfiguration, SortFieldDirection } from "../../../../models/common/ISortFieldConfiguration";
import { ISearchSortProperty } from "../../../../models/search/IMicrosoftSearchRequest";
import { getInternalSvg, SearchSvgIcon } from "../../../../helpers/SearchSvgHelper";
import { neutralFillHover, neutralFillInputHover, neutralFillInputRest, neutralFillRest } from "@microsoft/fast-components";
import { neutralFillInputHover as neutralFillInputHoverFluent } from "@fluentui/web-components";

export class SearchSortComponent extends BaseComponent {

    /**
     * Available sort properties and configuration
     */
    @property({ type: String, attribute: "sort-properties", converter: {
            fromAttribute: (value) => {
                try {
                    return JSON.parse(value);
                } catch {
                    return [];
                }
            },
        }
    })
    sortProperties: ISortFieldConfiguration[] = [];

    /**
     * Callback handler when the sort properties change 
     * @param sortProperties the sort properties
     */
    onSort: (sortProperties: ISearchSortProperty[]) => void;

    /**
     * The current selected field name in the dropdown list
     */
    @state()
    selectedFieldName: string = null;

    @state()
    selectedSortDirection: SortFieldDirection = SortFieldDirection.Descending;

    @state()
    isExpanded: boolean;

    constructor() {
        super();
        this.onSelectSort = this.onSelectSort.bind(this);

    }

    protected get localizedSelectedSortFieldName(): string {
        return this.getLocalizedString(this.sortProperties.filter(s => s.sortField === this.selectedFieldName)[0].sortFieldDisplayName);
    }

    protected override get strings(): { [x: string]: string; } {
        return strings;
    }

    override connectedCallback(): Promise<void> {

        // Initialize default sort according to configuration
        this.setDefaultSortProperty();

        // Same styles as filter
        neutralFillInputRest.setValueFor(this, neutralFillRest);
        neutralFillInputHoverFluent.setValueFor(this, neutralFillHover);
        neutralFillInputHover.setValueFor(this, neutralFillHover);

        return super.connectedCallback();
    }

    public override render() {

        if (this.sortProperties.length > 0) {

            let renderSortFieldName =  this.strings.sortedByRelevance;

            if (this.selectedFieldName) {
                renderSortFieldName = this.localizedSelectedSortFieldName;
            }

            return html`
                <div class=${`flex space-x-2 ${this.theme} justify-end`} >
                    <fast-select 
                        @click=${() =>{this.isExpanded = !this.isExpanded;}}
                        @blur=${() => {this.isExpanded = false;}}
                        position=${"below"}
                        class="w-44 min-w-min dark:hover:text-textColor"                     
                    >

                            <div class="flex items-center space-x-2 " slot="button-container">
                                <div part="selected-value" class="dark:text-textColorDark dark:active:text-textColor"><div data-ref="current-value">${renderSortFieldName}</div></div>
                                <div part="indicator">

                                    ${this.isExpanded ?
                                        html`<div class="text-primary w-3">${getInternalSvg(SearchSvgIcon.ArrowUp)}</div>`
                                        :
                                        html`<div class="text-primary w-3">${getInternalSvg(SearchSvgIcon.ArrowDown)}</div>`
                                    }
                                </div>
                        
                            </div>
        
                        <fast-option 
                            data-ref=${this.strings.sortDefault}
                            value=${this.strings.sortDefault}
                            @click=${() => this.onSelectSort(null, this.selectedSortDirection)}
                        >
                            <div class="dark:text-textColorDark text-textColor">${this.strings.sortDefault}</div>
                        </fast-option>
                        ${repeat(
                                this.sortProperties,
                                (s) => s.sortField,
                                (s) => {
                                    return html`
                                        <fast-option
                                            data-ref=${s.sortField}
                                            data-ref-label=${this.getLocalizedString(s.sortFieldDisplayName)}
                                            value=${s.sortField}
                                            @click=${() => this.onSelectSort(s.sortField, this.selectedSortDirection)}
                                        >
                                            <div class="dark:text-textColorDark text-textColor">${this.getLocalizedString(s.sortFieldDisplayName)}</div>
                                        </fast-option>`;
                                }
                        )}
                    </fast-select>
                    ${this.selectedSortDirection ?
                        html`
                            <button
                                type="button"
                                data-ref="sortdirection"
                                title=${this.selectedSortDirection === SortFieldDirection.Descending ? this.strings.sortDescending : this.strings.sortAscending}
                                @click=${() => {
                                    if (this.selectedFieldName) {
                                        this.onSelectSort(
                                            this.selectedFieldName, 
                                            this.selectedSortDirection === SortFieldDirection.Ascending ? SortFieldDirection.Descending : SortFieldDirection.Ascending);
                                        }
                                    }
                                }
                                class=${`${this.selectedFieldName ? "cursor-pointer" : "cursor-not-allowed"} text-primary dark:text-textColorDark`}
                            >
                                ${this.getSortIcon()}
                            </button>
                        `
                        : nothing
                    }
                    </div>
            `;
        } else {
            return nothing;
        }
    }

    public onSelectSort(sortFieldName: string, sortFieldDirection: SortFieldDirection) {

        if (sortFieldName !== this.selectedFieldName  || sortFieldDirection !== this.selectedSortDirection) {

            this.selectedFieldName = sortFieldName;
            this.selectedSortDirection = sortFieldDirection;

            let sortProperties: ISearchSortProperty[] = [];
            if (this.selectedFieldName && this.selectedSortDirection) {
                sortProperties = [
                    {
                        isDescending: this.selectedSortDirection === SortFieldDirection.Descending,
                        name: this.selectedFieldName
                    }
                ];
            }

            this.onSort(sortProperties);
        }
    }

    private getSortIcon() {
        return html`${this.selectedSortDirection === SortFieldDirection.Ascending ? getInternalSvg(SearchSvgIcon.SortAscending) : getInternalSvg(SearchSvgIcon.SortDescending)}`;
    }

    private setDefaultSortProperty() {
        
        const sortProperty = this.sortProperties.filter(s => s.isDefaultSort)[0];

        if (sortProperty) {
            this.selectedFieldName = sortProperty.sortField;
            this.selectedSortDirection = sortProperty.sortDirection;
        }
    }
}