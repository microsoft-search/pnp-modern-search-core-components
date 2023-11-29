
import { SearchInputComponent } from "../../components/search-input/SearchInputComponent";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.SearchInputComponent].toString(), SearchInputComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.SearchInputComponent]: SearchInputComponent;
  }
}