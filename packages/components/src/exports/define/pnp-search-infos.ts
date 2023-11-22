
import { SearchInfosComponents } from "../../components/search-infos/SearchInfosComponents";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.SearchInfosComponent].toString(), SearchInfosComponents);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.SearchInfosComponent]: SearchInfosComponents;
  }
}