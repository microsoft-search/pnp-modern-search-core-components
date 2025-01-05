import { DynamicProperty } from "@microsoft/sp-component-base";
import { IPropertyPaneConditionalGroup, IPropertyPaneGroup } from "@microsoft/sp-property-pane";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export default interface IDataSource {

    /**
     * The Web Part properties in the property bag. Corresponds to the isolated 'dataSourceProperties' property in the global property bag.
     */
    properties: unknown;

    /**
     * Dynamic properties to set <'name of the property',instance>
     */
    dynamicProperties: Map<string,DynamicProperty<unknown>>;

    /**
     * Context of the main Web Part
     */
    context: WebPartContext;

    /**
     * This API is called to render the web part.
     */
    render: () => void | Promise<void>;

    /**
     * Method called during the Web Part initialization.
     */
    onInit(): void | Promise<void>;
   
    /**
     * Returns the data source property pane option fields if any.
     */
    getPropertyPaneGroupsConfiguration(): IPropertyPaneGroup[] | IPropertyPaneConditionalGroup[];
    
    /**
     * Method called when a property pane field in changed in the Web Part.
     * @param propertyPath the property path.
     * @param oldValue the old value.
     * @param newValue the new value.
     */
    onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): void;
}