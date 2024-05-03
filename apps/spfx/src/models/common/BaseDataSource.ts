import { IPropertyPaneConditionalGroup, IPropertyPaneGroup } from "@microsoft/sp-property-pane";
import { ServiceScope } from '@microsoft/sp-core-library';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import IDataSource from "./IDataSource";
import { DynamicProperty } from "@microsoft/sp-component-base";

export abstract class BaseDataSource<T> implements IDataSource {

    protected serviceScope: ServiceScope;

    protected _properties: T;
    private _context: WebPartContext;
    private _render: () => void | Promise<void>;

    get properties(): T {
        return this._properties;
    }

    set properties(properties: T) {
        this._properties = properties;
    }

    get context(): WebPartContext {
        return this._context;
    }

    set context(context: WebPartContext) {
        this._context = context;
    }

    get render(): () => void {
        return this._render;
    }

    set render(renderFunc: () => void | Promise<void>) {
        this._render = renderFunc;
    }

    public constructor(serviceScope: ServiceScope) {
        this.serviceScope = serviceScope;
    }

    protected _dynamicProperties: Map<string, DynamicProperty<unknown>>;

    get dynamicProperties(): Map<string, DynamicProperty<unknown>> {
        return this._dynamicProperties;
    }
    
    set dynamicProperties(value: Map<string, DynamicProperty<unknown>>) {
        this._dynamicProperties = value;
    }

    public onInit(): void | Promise<void> {
        return;
    }

    public getPropertyPaneGroupsConfiguration(): IPropertyPaneGroup[] | IPropertyPaneConditionalGroup[] {

        // Returns an empty configuration by default
        return [];
    }

    public onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): void {
        // Do nothing by default      
    }
}