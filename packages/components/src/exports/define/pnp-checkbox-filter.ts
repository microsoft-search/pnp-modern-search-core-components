
import { CheckboxFilterComponent } from "../../components/search-filters/sub-components/filters/checkbox-filter/CheckboxFilterComponent";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.CheckboxFilterComponent].toString(), CheckboxFilterComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.CheckboxFilterComponent]: CheckboxFilterComponent;
  }
}