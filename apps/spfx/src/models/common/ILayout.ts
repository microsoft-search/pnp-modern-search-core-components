import { IPropertyPaneField } from "@microsoft/sp-property-pane";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ILayoutSlot } from "./ILayoutSlot";

export interface ILayoutProps {
    slots: ILayoutSlot[];
}

export interface ILayout {

    /**
     * The Web Part properties in the property bag. Corresponds to the isolated 'layoutProperties' property in the global property bag.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: any;

    /**
     * Context of the main Web Part
     */
    context: WebPartContext;

    /**
     * Method called during the Web Part initialization.
     */
    onInit(): void | Promise<void>;

    /**
     * Returns the layout property pane option fields if any
     * A good practice is to prefix property pane properties by the layout name like PropertyPaneTextField('customLayout.myTextProperty', {...})}
     * @param availableFields the available fields coming from results
     * @param dataContext the current data source data context
     */
    getPropertyPaneFieldsConfiguration(availableFields: string[]): IPropertyPaneField<unknown>[];
    
    /**
     * Method called when a property pane field in changed in the Web Part
     * @param propertyPath the property path
     * @param oldValue the old value
     * @param newValue the new value
     */
    onPropertyUpdate(propertyPath: string, oldValue: unknown, newValue: unknown): void;
}
