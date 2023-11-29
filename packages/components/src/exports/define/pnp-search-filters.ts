
import { SearchFiltersComponent } from "../../components/search-filters/SearchFiltersComponent";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.SearchFiltersComponent].toString(), SearchFiltersComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.SearchFiltersComponent]: SearchFiltersComponent;
  }
}