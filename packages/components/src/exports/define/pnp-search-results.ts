import { ComponentElements } from "../../common/Constants";
import { SearchResultsComponent } from "../../components/search-results/SearchResultsComponent";

customElements.define([ComponentElements.SearchResultsComponent].toString(), SearchResultsComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.SearchResultsComponent]: SearchResultsComponent;
  }
}