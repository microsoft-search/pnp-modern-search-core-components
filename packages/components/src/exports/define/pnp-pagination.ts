
import { PaginationComponent } from "../../components/search-results/sub-components/pagination/PaginationComponent";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.PaginationComponent].toString(), PaginationComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.PaginationComponent]: PaginationComponent;
  }
}