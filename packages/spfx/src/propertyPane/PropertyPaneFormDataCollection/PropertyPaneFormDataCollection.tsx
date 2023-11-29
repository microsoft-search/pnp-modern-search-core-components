import {
    IPropertyPaneField,
    PropertyPaneFieldType
  } from '@microsoft/sp-property-pane';
import * as ReactDom from 'react-dom';
import * as React from 'react';
import { IPropertyPaneFormDataCollectionProps } from './IPropertyPaneFormDataCollectionProps';
import { IPropertyPaneFormDataCollectionInternalProps } from './IPropertyPaneFormDataCollectionInternalProps';
import { FormDataCollection } from '../../controls/FormDataCollection/FormDataCollection';
import { IFormDataCollectionProps } from '../../controls/FormDataCollection/IFormDataCollectionProps';
import { BaseComponentContext } from '@microsoft/sp-component-base';

export class PropertyPaneFormDataCollection<T> implements IPropertyPaneField<IPropertyPaneFormDataCollectionProps<T>> {

    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public shouldFocus?: boolean;
    public properties: IPropertyPaneFormDataCollectionInternalProps<T>;
    private elem: HTMLElement;

    constructor(targetProperty: string, properties: IPropertyPaneFormDataCollectionProps<T>) {

        this.targetProperty = targetProperty;
        this.properties = {
            key: targetProperty,
            onRender: this.onRender.bind(this),
            onDispose: this.onDispose.bind(this),
            ...properties
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
    private onRender(elem: HTMLElement, ctx?: BaseComponentContext, changeCallback?: (targetProperty?: string, newValue?: T[]) => void): void {

        if (!this.elem) {
            this.elem = elem;
        }

        const props =  {
            ...this.properties,
            onChange: (newValues: T[], errors: Map<string,string>) => {
                // Don't save the field if there is an error
                if (!errors || errors?.size === 0) {
                    changeCallback(this.targetProperty, newValues)
                }

            }
        } as IFormDataCollectionProps<T>;

        const renderElement = <FormDataCollection<T> {...props}/>;
        ReactDom.render(renderElement, elem);
    }
}