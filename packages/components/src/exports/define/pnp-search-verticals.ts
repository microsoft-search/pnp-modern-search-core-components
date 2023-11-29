
import { SearchVerticalsComponent } from "../../components/search-verticals/SearchVerticalsComponent";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.SearchVerticalsComponent].toString(), SearchVerticalsComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.SearchVerticalsComponent]: SearchVerticalsComponent;
  }
}