import { html, PropertyValues } from "lit";
import { DateFilterKeys, BaseFilterComponent } from "../BaseFilterComponent";
import { DateHelper } from "../../../../../helpers/DateHelper";
import { FilterComparisonOperator, IDataFilterResultValue, IDataFilterValue } from "../../../../../models/common/IDataFilter";
import { FilterDateStrings as strings } from "../../../../../loc/strings.default";
import { nothing } from "lit";
import { LocalizationHelper } from "@microsoft/mgt-element/dist/es6/utils/LocalizationHelper";
import { getInternalSvg, SearchSvgIcon } from "../../../../../helpers/SearchSvgHelper";

export enum DateFilterInterval {
    AnyTime = "AnyTime",
    Today = "Today",
    Past24 = "Past24",
    PastWeek = "PastWeek",
    PastMonth = "PastMonth",
    Past3Months = "Past3Months",
    PastYear = "PastYear",
    OlderThanAYear = "OlderThanAYear"
}

export class DateFilterComponent extends BaseFilterComponent {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    declare private dayJs: any;
    declare private dateHelper: DateHelper;

    static override get scopedElements() { 
        return super.scopedElements; 
    }

    public get fromDate(): string {
        return this.getDateValue(DateFilterKeys.From);
    }

    public get toDate(): string {
        return this.getDateValue(DateFilterKeys.To);
    }
    
    public constructor() {
        super();

        this.dateHelper = new DateHelper();

        this.onUpdateFromDate = this.onUpdateFromDate.bind(this);
        this.onUpdateToDate = this.onUpdateToDate.bind(this);
        this.applyDateFilters = this.applyDateFilters.bind(this);
    }

    public override renderFilterContent() {

        // Intervals to display
        const intervals = this.filter.values.filter(v => {

            // If an interval is already selected, limit to only one to avoid selecting multiple matched intervals for the same items
            // Ex: an item created last month will also match the past 3 months, and past year intervals. However, it does not make sense to propose all at once once user selects one.
            if (this.selectedValues.length > 0) {
                return this.selectedValues.some(s => s.key === v.key); 
            } 
            return v.count > 0;
        });

        return html`
                    <div class="sticky top-0 flex justify-between items-center px-6 py-3 space-x-2 bg-white dark:bg-primaryBackgroundColorDark dark:text-textColorDark 10 min-h-[48px]">
                        <div class="opacity-75"><label>${this.selectedValues.length} ${this.strings.selections}</label></div>
                        ${this.selectedValues.length > 0 ? 
                            html`<div class="flex cursor-pointer space-x-1 items-center hover:text-primary opacity-75" @click=${() => this.clearSelectedValues()}>

                                <div class="flex cursor-pointer space-x-1 items-center hover:text-primary opacity-75 dark:text-textColorDark">
                                        ${getInternalSvg(SearchSvgIcon.Refresh)}
                                        <span>${this.strings.reset}</span>
                                    </div>
                                </div>` 
                            : null
                        }
                    </div>
                    <fast-menu class="p-2 rounded-none max-h-80 overflow-auto">
                        ${!this.fromDate && !this.toDate ?
                            intervals.map(filterValue => {
                                return html`
                                        <fast-menu-item
                                            class="dark:text-textColorDark dark:hover:text-textColor mb-2 mt-2"
                                            @click=${(e) => {
                                                // Use a mouse down event to not trigger the parent blur() event and close the panel before selecting a value
                                                e.preventDefault();
                                                this.onItemUpdated(filterValue, !this.isSelectedValue(filterValue.key));

                                                if (!this.filterConfiguration.isMulti) {
                                                    this.applyFilters();
                                                }
                                            }}
                                            data-ref-value=${filterValue.value}
                                            data-ref-name=${filterValue.name}
                                            role="menuitemcheckbox"
                                            ?checked=${this.isSelectedValue(filterValue.key)}
                                            ?ariaChecked=${this.isSelectedValue(filterValue.key)}
                                        >
                                            <div class="flex items-center space-x-3">
                                                <div>
                                                    <label class="font-medium ${this.isSelectedValue(filterValue.key) ? "text-primary" : ""}">${this._getIntervalForValue(filterValue)}</label>
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
                            :
                            nothing
                        }
                    </fast-menu>
                    <div class="flex flex-col px-6 py-3 text-sm space-y-2 bg-white dark:bg-primaryBackgroundColorDark border-t border-gray-400 border-opacity-25">
                        <div class="flex flex-col">
                            <span class="opacity-75 dark:text-textColorDark">${this.strings.from}:</span>
                            <input  id="from" 
                                    type="date"
                                    max=${this.toDate} 
                                    .value=${this.fromDate} 
                                    @change=${this.onUpdateFromDate}  
                            />   
                        </div>
                        
                        <div class="flex flex-col">
                            <span class="opacity-75 dark:text-textColorDark">${this.strings.to}:</span>
                            <input  id="to"
                                    type="date"
                                    min=${this.fromDate}
                                    max=${new Date().toISOString().split("T")[0]}
                                    .value=${this.toDate} 
                                    @change=${this.onUpdateToDate}
                            />
                        </div>                        
                        <fast-button appearance="accent" class="flex justify-center min-w-[140px] font-medium ${((!this.toDate && !this.fromDate) || !this.canApplyValues) ? "opacity-50 cursor-not-allowed pointer-events-none": ""}" @click=${this.applyDateFilters}>${this.strings.applyDates}</fast-button>
                    </div>
            `;
    }

    public override async connectedCallback(): Promise<void> {

        this.dayJs = await this.dateHelper.dayJs(LocalizationHelper.strings?.language as string);

        super.connectedCallback();
    }
    
    protected override get strings(): { [x: string]: string; } {
        return strings;
    }

    protected override updated(changedProperties: PropertyValues<this>): void {

        super.updated(changedProperties);
        if (changedProperties.has("filter")) {
            this.filter.values = this.updateFilterValuesKey(this.filter.values);
        }
    }

    private updateFilterValuesKey(values: IDataFilterResultValue[]) {

        // Update the key for each filter value to match their corresponding data interval instead of relying on the raw value
        // This way we avoid comparaison mismatch from the time the filter is selected and the time wheere the value is retrieved from results
        return values.map(value => {
            value.key = this._getIntervalFromDateString(value.key);
            return value;
        });
    }
    
    private _getIntervalDate(unit: string, count: number): Date {
        return this._getIntervalDateFromStartDate(new Date(), unit, count);
    }

    private _getIntervalDateFromStartDate(startDate: Date, unit: string, count: number): Date {
        return this.dayJs(startDate).subtract(count, unit);
    }

    private _getIntervalForValue(filterValue: IDataFilterValue): string {

        filterValue.name =  this.getAllIntervals()[this._getIntervalFromDateString(filterValue.value)];
        return filterValue.name;
    }

    private _getIntervalFromDateString(dateAsString: string): DateFilterInterval {

        let dateInterval = DateFilterInterval.AnyTime;

        if (dateAsString && this.dayJs) {

            let dateRanges = [];
            // Value from Microsoft Search for date properties as FQL filter value
            if (dateAsString.indexOf("range(") !== -1) {
                const matches = dateAsString.match(/(min|max)|(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)/gi);
                if (matches) {

                    // Return date range (i.e. dates between parenthesis)
                    dateRanges  = matches;
                }
            }

            // To get it work, we need to submit equivalent aggregations at query time
            const past24Date = this._getIntervalDate("days", 1);
            const pastWeekDate = this._getIntervalDate("weeks", 1);
            const pastMonthDate = this._getIntervalDate("months", 1);
            const past3MonthsDate = this._getIntervalDate("months", 3);
            const pastYearDate = this._getIntervalDate("years", 1);

            // Mutate the original object to get the correct name when submitted
            if (dateRanges.indexOf("min") !== -1) {
                dateInterval = DateFilterInterval.OlderThanAYear;
            } else if (dateRanges.indexOf("max") !== -1) {
                dateInterval = DateFilterInterval.Today;
            } else if (this.dayJs(dateRanges[0]).isSame(past24Date, "day")) {
                dateInterval =  DateFilterInterval.Past24;
            } else if (this.dayJs(dateRanges[0]).isSame(pastWeekDate, "day")) {
                dateInterval =  DateFilterInterval.PastWeek;
            } else if (this.dayJs(dateRanges[0]).isSame(pastMonthDate, "day")) {
                dateInterval = DateFilterInterval.PastMonth;
            } else if (this.dayJs(dateRanges[0]).isSame(past3MonthsDate, "day")) {
                dateInterval =  DateFilterInterval.Past3Months;
            } else if (this.dayJs(dateRanges[0]).isSame(pastYearDate, "day")) {
                dateInterval = DateFilterInterval.PastYear;
            }
        }

        return dateInterval;
    } 

    private onUpdateFromDate(e: InputEvent) {

        let date = (e.target as HTMLInputElement).value;

        // In the case user enter manually a date later than today
        if (this.dayJs(date).isValid() && this.dayJs(date).isAfter(this.dayJs())) {
            date = new Date().toISOString().split("T")[0];
        }

        const filterName = `${this.strings.from} ${this.dayJs(date).format("ll")}`;
        this.onItemUpdated(
            {
                key: DateFilterKeys.From,
                name: filterName,
                value: date ? new Date(date).toISOString() : null,
                operator: FilterComparisonOperator.Geq
            },
            !!date // No value = unselected
        );
        
        if (!date && this.submittedFilterValues.length > 0) {
            this.applyFilters();
        }
    }

    private onUpdateToDate(e) {

        let date = (e.target as HTMLInputElement).value;

        // In the case user enter manually a date later than today
        if (this.dayJs(date).isValid() && this.dayJs(date).isAfter(this.dayJs())) {
            date = new Date().toISOString().split("T")[0];
        }

        const filterName = `${this.strings.to} ${this.dayJs(date).format("ll")}`;
        this.onItemUpdated(
            {
                key: DateFilterKeys.To,
                name: filterName,
                value: date ? new Date(date).toISOString() : null,
                operator: FilterComparisonOperator.Lt
            },
            !!date // No value = unselected
        );

        if (!date && this.submittedFilterValues.length > 0) {
            this.applyFilters();
        }
    }

    private applyDateFilters() {

        // Don't apply filters if no value is selected
        if (this.toDate || this.fromDate) {

            // Keep only static filter values 'From' and 'To' and unselect the others if any
            this.selectedValues.filter(v => v.key !== DateFilterKeys.To && v.key !== DateFilterKeys.From).forEach(v => {
                this.onFilterUpdated(this.filter.filterName, v, false);
            });;

            this.selectedValues = this.selectedValues.filter(v => v.key === DateFilterKeys.To || v.key === DateFilterKeys.From);

            this.applyFilters();
        }
    }

    private getDateValue(dateKey: DateFilterKeys) {

        const date = this.selectedValues.filter(v => v.key === dateKey)[0];
        if (date) {
            return date.value.split("T")[0];
        }

        return "";
    }

    private getAllIntervals() {
        return {
            [DateFilterInterval.AnyTime]:  this.strings.anyTime,
            [DateFilterInterval.Today]:  this.strings.today,
            [DateFilterInterval.Past24]: this.strings.past24,
            [DateFilterInterval.PastWeek]: this.strings.pastWeek,
            [DateFilterInterval.PastMonth]: this.strings.pastMonth,
            [DateFilterInterval.Past3Months]: this.strings.past3Months,
            [DateFilterInterval.PastYear]: this.strings.pastYear,
            [DateFilterInterval.OlderThanAYear]: this.strings.olderThanAYear
        };

    }
}