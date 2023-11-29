
import { SearchSortComponent } from "../../components/search-filters/sub-components/search-sort/SearchSortComponent";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.SearchSortComponent].toString(), SearchSortComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.SearchSortComponent]: SearchSortComponent;
  }
}