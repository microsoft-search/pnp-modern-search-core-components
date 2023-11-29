
import { LanguageProviderComponent } from "../../components/language-provider/LanguageProviderComponent";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.LanguageProviderComponent].toString(), LanguageProviderComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.LanguageProviderComponent]: LanguageProviderComponent;
  }
}