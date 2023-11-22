import { html, PropertyValueMap, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { BaseComponent } from "../../../BaseComponent";
import { chunk, range } from "lodash-es";
import { PaginationStrings as strings } from "../../../../loc/strings.default";
import { getInternalSvg, SearchSvgIcon } from "../../../../helpers/SearchSvgHelper";

export enum RangeDotNotation {
    DotRange = "..."
}

/**
 * Maximum number of pages considered as safe to browse until getting inaccurate count from the Microsoft Search API.
 */
const MAX_PAGE_LIMIT = 2000;

export class PaginationComponent extends BaseComponent {

    /**
     * The total number of items retrieved from the data source if known.
     */
    @property({attribute: false})
    totalItems: number;

    /**
     * The number of items per page
     */
    @property({attribute: false})
    itemsCountPerPage: number;

    /**
     * The number of pages to display in range
     */
    @property({attribute: false})
    numberOfPagesToDisplay: number;

    /**
     * Handler when a new page is selected
     */
    @property({attribute: false})
    onPageNumberUpdated: (pageNumber: number) => void;

    /**
     * The current page number. Always start from 1
     */
    @state()
    currentPageNumber = 1;

    /**
     * The current page range start to show
     */
    declare currentRangeStart: number;

    /**
     * The current page range end to show
     */
    declare currentRangeEnd: number;

    /**
     * The total number of pages available 
     */
    declare numberOfPages: number;

    public constructor() {
        super();
    }
    
    public override render() {

        // Determine pages to display in the current range
        // '+1' is to include the last page in the range (excluded by default in range() method)
        let pagesToRender = range(this.currentRangeStart, this.currentRangeEnd + 1, 1).map(p => p.toString());

        if (this.numberOfPages < this.currentRangeEnd -1) {
            pagesToRender = range(this.currentRangeStart, this.numberOfPages + 1, 1).map(p => p.toString());

        } else {

            if (this.currentRangeStart > 1) {
                pagesToRender.unshift(RangeDotNotation.DotRange);
                pagesToRender.unshift("1");
            }

            if (this.currentRangeEnd < this.numberOfPages) {
                pagesToRender.push(RangeDotNotation.DotRange);
                pagesToRender.push(this.numberOfPages.toString());
            }

        }

         return html`    
            <div class=${this.theme}>    
                <ul class="font-sans text-sm font-normal flex space-x-1 last:p-0 items-center dark:text-textColorDark" aria-live="polite">
                    ${this.numberOfPages > 1 ? 
                        html`
                            <li class="dark:text-textColorDark">
                                <button data-ref="previous-btn" class="mr-1 items-center flex space-x-2 ${this.currentPageNumber === 1 ? "opacity-75 pointer-events-none": ""}" ?disabled=${this.currentPageNumber === 1} @click=${() => {this.previousPage();}}>
                                <div class="w-[16px]">${getInternalSvg(SearchSvgIcon.ArrowLeft)}</div>
                                    <span>${this.strings.previousBtn}</span>
                                </button>
                            </li>
                        `
                        : null
                    }
                    ${pagesToRender.map(pageNumber => {

                        const isFirstPage = pageNumber !== RangeDotNotation.DotRange  && parseInt(pageNumber) === 1;
                        const isLastPage = pageNumber !== RangeDotNotation.DotRange  && parseInt(pageNumber) === this.numberOfPages;
                        return html`
                            <li class=${this.getButtonClass(pageNumber)}>
                                ${pageNumber != RangeDotNotation.DotRange ? 
                                    html`
                                        ${parseInt(pageNumber) > MAX_PAGE_LIMIT ? 
                                            html`
                                                <span title=${this.strings.screenTipContent}>${this.strings.tooManyPages}</span>                                                
                                            ` 
                                        :
                                            html`<button data-ref=${isFirstPage ? "first" : (isLastPage ? "last" : "page")} @click=${() => { this.setPageNumber(parseInt(pageNumber));}}>${pageNumber}</button>`
                                        }
                                    `
                                :
                                    html`<div data-ref="dot">${pageNumber}</div>`
                                }                            
                            </li>
                        `;  
                    })}
                    ${this.numberOfPages > 1 ? 
                        html`
                            <li>
                                <button data-ref="next-btn" class="ml-1 items-center flex space-x-2 ${this.currentPageNumber === this.numberOfPages ? "opacity-75 pointer-events-none": ""}" ?disabled=${this.currentPageNumber === this.numberOfPages} @click=${() => { this.nextPage();}}>
                                    <span>${this.strings.nextBtn}</span>
                                    <div class="w-[16px]">${getInternalSvg(SearchSvgIcon.ArrowRight)}</div>
                                </button>
                            </li>
                        ` 
                        : null
                    }
                </ul>
            </div>
        `;
    }

    public initPagination() {
        this.currentPageNumber = 1;
        this.currentRangeStart = 1;
        this.currentRangeEnd = this.numberOfPagesToDisplay;
        this.requestUpdate();
    }

    private getButtonClass(pageNumber: string) {

        if (pageNumber != RangeDotNotation.DotRange) {

            if (parseInt(pageNumber) === this.currentPageNumber) {
                return "px-3 py-1 font-bold rounded-lg bg-primary opacity-[0.20] dark:opacity-[1] text-white";
            } else {
                return "px-3 py-1 hover:bg-black/[0.02] hover:rounded-lg";
            }
        }

        return "";
    }

    public setPageNumber(pageNumber: number) {

        this.currentPageNumber = pageNumber;

        if (pageNumber === 1) {

            // First page
            this.initPagination();

        } else if (pageNumber === this.numberOfPages && this.numberOfPages > this.numberOfPagesToDisplay) {

            // Last Page
            this.currentRangeStart = this.numberOfPages - this.numberOfPagesToDisplay + 1; // To include the last page already here and respect the 'numberOfPagesToDisplay' count  
            this.currentRangeEnd = this.numberOfPages; 

        } else if (pageNumber > this.currentRangeEnd) {

            // Next range
            this.currentRangeStart = this.currentRangeStart + this.numberOfPagesToDisplay;                
            this.currentRangeEnd = this.currentRangeEnd + this.numberOfPagesToDisplay;

        } else  if (pageNumber < this.currentRangeStart) {

            // Previous range
            const nextRangeStart = this.currentRangeStart - this.numberOfPagesToDisplay;
            this.currentRangeStart = nextRangeStart < 1 ? 1 : nextRangeStart;
            this.currentRangeEnd = nextRangeStart < 1 ? this.numberOfPagesToDisplay : this.currentRangeEnd - this.numberOfPagesToDisplay;
        }

        // Readjust range if the current page number is outside of the next/previous logical range (ex: set programatically)
        if (!(pageNumber >= this.currentRangeStart && pageNumber <= this.currentRangeEnd)) {
            
            /*
                - Calculate all possible ranges according to the total pages and number of pages per range
                - Get the correct range for the current page number
                - The range start should be the first item in the range table and the range end the last
            */
            const allRanges = range(1, this.numberOfPages+1);
            const allPossibleRanges = chunk(allRanges, this.numberOfPagesToDisplay);
            const currentRangeArray = allPossibleRanges.find(rangeArray => {
                return rangeArray.indexOf(pageNumber) !== -1;
            });

            this.currentRangeStart = currentRangeArray[0];
            this.currentRangeEnd = currentRangeArray[currentRangeArray.length-1];
        }

        this.onPageNumberUpdated(pageNumber);
    }

    private nextPage() {

        const newPageNumber = this.currentPageNumber + 1;

        if (newPageNumber <= this.numberOfPages) {
            this.setPageNumber(newPageNumber);            
        }
    }

    private previousPage() {

        const newPageNumber = this.currentPageNumber - 1;

        if (newPageNumber >= 1) {
            this.setPageNumber(newPageNumber);
        }
    }

    protected override update(changedProperties: PropertyValues<this>): void {

        if (changedProperties.get("totalItems") !== this.totalItems) {

            // Recalculate the number of available pages
            this.numberOfPages = Math.ceil(this.totalItems / this.itemsCountPerPage);
        }

        super.update(changedProperties);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected override firstUpdated(changedProperties: PropertyValues<this>): void {
        this.initPagination();
    }

    protected override updated(changedProperties: PropertyValueMap<this>): void {
        if (changedProperties.has("itemsCountPerPage") ||
            changedProperties.has("numberOfPagesToDisplay")) {
            this.initPagination();
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected override get strings(): { [x: string]: any ; } {
        return strings;
    }
}
