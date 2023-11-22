import { IPropertyPaneField, PropertyPaneFieldType } from "@microsoft/sp-property-pane";
import * as ReactDom from 'react-dom';
import * as React from 'react';
import { IPropertyPaneFilePickerProps } from "./IPropertyPaneFilePickerProps";
import { IPropertyPaneFilePickerInternalProps } from "./IPropertyPaneFilePickerInternalProps";
import { PropertyPaneFilePickerHost } from "./components/PropertyPaneFilePickerHost";
import { IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';

export class PropertyPaneFilePicker implements IPropertyPaneField<IPropertyPaneFilePickerProps> {
    
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneFilePickerInternalProps;
    private elem: HTMLElement;

    constructor(targetProperty: string, properties: IPropertyPaneFilePickerProps) {

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

    private onRender(elem: HTMLElement, ctx?: unknown, changeCallback?: (targetProperty?: string, newValue?: IFilePickerResult) => void): void {

        if (!this.elem) {
            this.elem = elem;
        }

        const element = <PropertyPaneFilePickerHost
                            key={this.properties.label}
                            label={this.properties.label}
                            componentContext={this.properties.componentContext}
                            filePickerResult={this.properties.filePickerResult}
                            onFileSelected={(filePickerResult: IFilePickerResult) => {
                                changeCallback(this.targetProperty, filePickerResult)
                            }}
                        />;

        ReactDom.render(element, elem);
    }

}
