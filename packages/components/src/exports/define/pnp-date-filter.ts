
import { DateFilterComponent } from "../../components/search-filters/sub-components/filters/date-filter/DateFilterComponent";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.DateFilterComponent].toString(), DateFilterComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.DateFilterComponent]: DateFilterComponent;
  }
}