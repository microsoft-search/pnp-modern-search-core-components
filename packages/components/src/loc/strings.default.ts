import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ComponentElements } from "../common/Constants";

export const SearchResultsStrings = {
    seeAllLink: "See all",
    results: "results"
};

export const PaginationStrings = {
    nextBtn: "Next",
    previousBtn: "Previous",
    tooManyPages: "Too many pages!",
    screenTipContent: `It seems your search returned a lot of pages!
Try to narrow down your scope by specifying more precise keywords🙏`
};

export const FilterDateStrings = {
    anyTime: "Any time",
    today: "Today",
    past24: "Past 24 hours",
    pastWeek: "Past week",
    pastMonth: "Past month",
    past3Months: "Past 3 months",
    pastYear: "Past year",
    olderThanAYear: "Older than a year",
    reset: "Reset",
    from: "From",
    to: "To",
    applyDates: "Apply dates",
    selections: "selection(s)"
};

export const FilterCheckboxStrings = {
    reset: "Reset",
    searchPlaceholder: "Search for values...",
    apply: "Apply",
    cancel: "Cancel",
    selections: "selection(s)"
};

export const SearchFiltersStrings = {
    resetAllFilters: "Reset filters",
    noFilters: "No filter to display"
};

export const SearchSortStrings = {
    sortedByRelevance: "Sorted by relevance",
    sortDefault:"Relevance",
    sortAscending: "Sort ascending",
    sortDescending: "Sort descending",
};

export const SearchInputStrings = {
    searchPlaceholder: "Search for values...",
    clearSearch: "Clear searchbox",
    previousSearches: "Previous searches"
};

export const LanguageProviderStrings = {};

export const SearchInfosStrings = {
    searchQueryResultText: (keywords) : string => `Here's what we found for "${keywords}"`,
    resultCountText: (count): string  => `Found ${count} results you have permissions to see.`,
    notFoundSuggestions: (keywords) => html`
                    <h2 class="font-primary text-3xl mb-4">Your search for "${keywords}" did not match any content.</h2>
                    <p>Some suggestions:</p>
                    <ul class="list-disc pl-8">
                        <li>Make sure all words are spelled correctly</li>
                        <li>Try entering different keywords, more general keywords or less keywords</li>
                        <li>Maybe what you were looking for is not in the scope of the Enterprise Search? Check all the sources we index in our <a href="https://goto..org/SearchFAQ" target="_blank" class="text-primary font-bold hover:underline">FAQ page</a>.</li>
                        <li>... Or ask for help by submitting a <a href="https://goto..org/SearchSOS" target="_blank" class="text-primary font-bold hover:underline">SOS ticket</a> and our colleagues will try their best to help you.</li>
                    </ul>
    `,
    didYouMean: (handlerFunction, updatedQueryString) => html`
        <p>Did you mean: "<a href="#" @click=${handlerFunction}>${unsafeHTML(updatedQueryString)}"?</a></p> 
    `
};

export const ErrorMessageStrings = {
    errorMessage: "Error"
};

export const strings = { 
    language: "en-us",
    _components: {
        [ComponentElements.SearchResultsComponent]: {...SearchResultsStrings},
        [ComponentElements.PaginationComponent]: {...PaginationStrings},
        [ComponentElements.DateFilterComponent]: {...FilterDateStrings},
        [ComponentElements.CheckboxFilterComponent]: {...FilterCheckboxStrings},
        [ComponentElements.SearchFiltersComponent]: {...SearchFiltersStrings},
        [ComponentElements.SearchInputComponent]: {...SearchInputStrings},
        [ComponentElements.LanguageProviderComponent]: {...LanguageProviderStrings},
        [ComponentElements.SearchInfosComponent]: {...SearchInfosStrings},
        [ComponentElements.ErrorMessageComponent]: {...ErrorMessageStrings},
        [ComponentElements.SearchSortComponent]: {...SearchSortStrings}
    }
};
