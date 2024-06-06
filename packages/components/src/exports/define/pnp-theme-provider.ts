
import { ThemeProviderComponent } from "../../components/theme-provider/ThemeProviderComponent";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.ThemeProviderComponent].toString(), ThemeProviderComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.ThemeProviderComponent]: ThemeProviderComponent;
  }
}