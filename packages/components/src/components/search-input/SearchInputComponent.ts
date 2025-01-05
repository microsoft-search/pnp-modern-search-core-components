import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { cloneDeep, isEmpty, isEqual } from "lodash-es";
import { EventConstants } from "../../common/Constants";
import { PageOpenBehavior, QueryPathBehavior, UrlHelper } from "../../helpers/UrlHelper";
import { ISearchInputEventData } from "../../models/events/ISearchInputEventData";
import { BaseComponent } from "../BaseComponent";
import { SearchInputStrings as strings } from "../../loc/strings.default";
import { getSvg, SvgIcon } from "@microsoft/mgt-components/dist/es6/utils/SvgHelper";
import { Providers } from "@microsoft/mgt-element/dist/es6/providers/Providers";
import { IProvider, ProviderState } from "@microsoft/mgt-element/dist/es6/providers/IProvider";

export class SearchInputComponent extends BaseComponent {

    /**
     * If specified, get the default query text from this query string parameter name
     */
    @property({ type: String, attribute: "default-query-string-parameter"})
    defaultQueryStringParameter: string;

    /**
     * Flag indicating in the search query text should be sent to an other page
     */
    @property({ type: Boolean, attribute: "search-in-new-page" })
    searchInNewPage = false;

    /**
     * The page URL to send the query text
     */
    @property({ type: String, attribute: "search-page-url" })
    pageUrl: string;

    /**
     * Whether to use an URL fragment (#) or query string parameter to pass the query text
     */
    @property({ type: String, attribute: "query-behavior" })
    queryPathBehavior: QueryPathBehavior = QueryPathBehavior.QueryParameter;

    /**
     * The query string parameter to use to send the query text
     */
    @property({ type: String, attribute: "query-parameter" })
    queryStringParameter = "q";

    /**
     * Flag indicating if the search box should open a new tab or use the current page
     */
    @property({ type: String, attribute: "open-behavior" })
    openBehavior: PageOpenBehavior = PageOpenBehavior.NewTab;

    /**
     * Placeholder text for the search box
     */
    @property({ type: String, attribute: "placeholder" })
    inputPlaceholder: string;

    @state()
    searchKeywords: string;

    @state()
    hasValidationError: boolean;

    declare _submittedKeywords: string;

    static override get styles() {
        return [
            BaseComponent.themeStyles, // Allow component to use them CSS variables from design. The component is a first level component so it is OK to define theme variables here
            BaseComponent.styles // Use base styles (i.e. Tailwind CSS classes)
        ];
    }

    protected override get strings(): { [x: string]: string; } {
      return strings;
    }

    constructor() {
        super();
        this.onInputChange = this.onInputChange.bind(this);
        this.clearSearchKeywords = this.clearSearchKeywords.bind(this);
    }

    public override render() {

      const renderSearchBox = html`
        <form @submit=${(e) => { e.preventDefault(); this.submitSearch();}} class=${this.theme}>
          <fast-search
              id="searchbox"
              class=${`${this.hasValidationError ? "border-red-500" : ""} block w-full rounded-lg bg-transparent transition placeholder:text-searchPlaceholder dark:placeholder-textColorDark dark:placeholder-opacity-50 focus:border-searchBorderFocus focus:shadow-none focus:ring-transparent`}
              autocomplete="off"
              autofocus
              .value=${this.searchKeywords ? this.searchKeywords : ""} 
              placeholder=${this.inputPlaceholder ? this.inputPlaceholder : strings.searchPlaceholder} 
              @change=${this.onInputChange} 
              @input=${this.onInputChange}
          >
            <button slot="start" type="submit" class="text-primary dark:fill-textColorDark p-2 w-8 h-8 flex items-center justify-center">
                ${getSvg(SvgIcon.Search)}
                <span class="sr-only">Search</span>
            </button>
          </fast-search>
        </form>
      `;

      return renderSearchBox;
    }

    protected onInputChange(e) {
        this.searchKeywords = e.target.value ? e.target.value.trim() : e.target.value;

        const provider = Providers.globalProvider;
        if (!provider || provider.state !== ProviderState.SignedIn) {
            return;
        }
    }

    protected clearSearchKeywords() {
        (this.renderRoot.querySelector("#searchbox") as HTMLInputElement).value = null;
        this.searchKeywords = null;
    }

    public submitSearch() {

      if (this.searchInNewPage && this.pageUrl) {

        const urlEncodedQueryText = encodeURIComponent(this.searchKeywords);
        const searchUrl = new URL(this.pageUrl);
        let newUrl;

        if (this.queryPathBehavior === QueryPathBehavior.URLFragment) {
            searchUrl.hash = urlEncodedQueryText;
            newUrl = searchUrl.href;
        } else {
            newUrl = UrlHelper.addOrReplaceQueryStringParam(searchUrl.href, this.queryStringParameter, this.searchKeywords);
        }

        // Send the query to the new page
        const behavior = this.openBehavior === PageOpenBehavior.NewTab ? "_blank" : "_self";

        window.open(newUrl, behavior);

      } else {

        this.fireCustomEvent(EventConstants.SEARCH_INPUT_EVENT, {
            keywords: this.searchKeywords
        } as ISearchInputEventData);

        this._submittedKeywords = cloneDeep(this.searchKeywords);
      }

      // Update query string parameter if needed
      const keywords = UrlHelper.getQueryStringParam(this.defaultQueryStringParameter, window.location.href);
      if (this.defaultQueryStringParameter && keywords && !isEqual(this.searchKeywords, keywords)) {    
            
        const url = this.searchKeywords ? 
                    UrlHelper.addOrReplaceQueryStringParam(window.location.href, this.defaultQueryStringParameter, this.searchKeywords) :
                    UrlHelper.removeQueryStringParam(this.defaultQueryStringParameter, window.location.href);

        window.history.pushState({},"",url);
      }
    }

    protected override loadState(): Promise<void> {
      this.handleQueryStringChange();
      this.initializeDefaultValue();

      return super.loadState();
    }

    public override connectedCallback(): Promise<void> {
    
      return super.connectedCallback();
    }

    /**
     * Initialize the default search keywords value according to settings
     */
    private initializeDefaultValue() {

      // Look query string parameters
      if (this.defaultQueryStringParameter) {
        const keywords = UrlHelper.getQueryStringParam(this.defaultQueryStringParameter, window.location.href);
      
        if (keywords && !isEmpty(decodeURIComponent(keywords).trim())) {
          this.searchKeywords = decodeURIComponent(keywords).trim();
        }
      }
    }

    /**
     * Subscribes to URL query string change events using windows state
     */
    private handleQueryStringChange() {

      if (this.defaultQueryStringParameter) {

        // Will fire on browser back/forward
        window.onpopstate = () => {

          const newKeywords = UrlHelper.getQueryStringParam(this.defaultQueryStringParameter, window.location.href);
      
          if (newKeywords && !isEmpty(decodeURIComponent(newKeywords).trim())) {
            this.searchKeywords = decodeURIComponent(newKeywords).trim();

            // Only submit the search when a keyword is present
            this.submitSearch();
          }
        };
      }
    }
}