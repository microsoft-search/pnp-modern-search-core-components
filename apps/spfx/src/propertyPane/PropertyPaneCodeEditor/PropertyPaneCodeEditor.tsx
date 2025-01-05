import { IPropertyPaneField, PropertyPaneFieldType } from "@microsoft/sp-property-pane";
import { IPropertyPaneCodeEditorProps } from "./IPropertyPaneCodeEditorProps";
import { IPropertyPaneCodeEditorInternalProps } from "./IPropertyPaneCodeEditorInternalProps";
import * as ReactDom from 'react-dom';
import * as React from 'react';
import { PropertyPaneCodeEditorHost } from "./components/PropertyPaneCodeEditorHost";

export class PropertyPaneCodeEditor implements IPropertyPaneField<IPropertyPaneCodeEditorProps> {
    
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneCodeEditorInternalProps;
    private elem: HTMLElement;

    constructor(targetProperty: string, properties: IPropertyPaneCodeEditorProps) {

        this.targetProperty = targetProperty;
        this.properties = {
            key: targetProperty,
            label: properties.label,
            onRender: this.onRender.bind(this),
            onDispose: this.onDispose.bind(this),
            ...properties,
        };
      }
    
    public render(): void {
        if (!this.elem) {
            return;
        }

        this.onRender(this.elem);
    }

    private onDispose(element: HTMLElement): void {
        ReactDom.unmountComponentAtNode(element);
    }

    private onRender(elem: HTMLElement, ctx?: unknown, changeCallback?: (targetProperty?: string, newValue?: string) => void): void {

        if (!this.elem) {
            this.elem = elem;
        }

        const element = <PropertyPaneCodeEditorHost
                            {...this.properties}
                            onValueChange={(value) => {
                                changeCallback(this.targetProperty, value)
                            }}
                        />;

        ReactDom.render(element, elem);
    }

}
