import {
    IPropertyPaneField,
    PropertyPaneFieldType
  } from '@microsoft/sp-property-pane';
import * as ReactDom from 'react-dom';
import * as React from 'react';
import { ComboBox, IComboBox, IComboBoxOption, IComboBoxProps } from 'office-ui-fabric-react';
import { IPropertyPaneComboBoxInternalProps } from './IPropertyPaneComboBoxInternalProps';
import { IPropertyPaneComboboxProps } from './IPropertyPaneComboBoxProps';

export class PropertyPaneCombobox implements IPropertyPaneField<IPropertyPaneComboboxProps> {

    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneComboBoxInternalProps;
    private elem: HTMLElement;
    private comboBoxRef = React.createRef<IComboBox>();
    
    constructor(targetProperty: string, properties: IPropertyPaneComboboxProps) {

        this.targetProperty = targetProperty;
        this.properties = {
            key: targetProperty,
            label: properties.label,
            onRender: this.onRender.bind(this),
            onDispose: this.onDispose.bind(this),
            onValueChange: properties.onValueChange,
            ...properties,
            componentRef: this.comboBoxRef
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

    private onRender(elem: HTMLElement, ctx?: unknown, changeCallback?: (targetProperty?: string, newValue?: string[]) => void): void {

        if (!this.elem) {
            this.elem = elem;
        }

        const element: React.ReactElement<IComboBoxProps> = React.createElement(ComboBox,
            {
                ...this.properties,
                onChange: (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
                    
                    // Add the value to the existing available options but keep their current selected state
                    let currentOptions = this.properties.options.map(option => {
                        option.selected = this.comboBoxRef.current.selectedOptions.some(o => o.key === option.key);
                        return option;
                    });

                    if (option) {
                        const selectedOptions = this.comboBoxRef.current.selectedOptions.map(o => o.key as string);
                        changeCallback(this.targetProperty, selectedOptions);
                    } 

                    if (this.properties.allowFreeform && !option && value) {

                        currentOptions = [...currentOptions, {key: value, text: value, selected: true}];
                        changeCallback(this.targetProperty, currentOptions.filter(o => o.selected).map(o => o.key as string));
                    }

                    // Optional callback to allow parent to update the available options
                    if (this.properties.onValueChange) {
                        this.properties.onValueChange(currentOptions);
                    }
                }
            }
        );
        ReactDom.render(element, elem);
    }
}