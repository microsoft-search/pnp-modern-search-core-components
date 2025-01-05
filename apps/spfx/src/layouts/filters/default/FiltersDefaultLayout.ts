import { IPropertyPaneField } from "@microsoft/sp-property-pane";
import { BaseLayout } from "../../../models/common/BaseLayout";
import { ServiceScope } from "@microsoft/sp-core-library";
import { ILayoutProps } from "../../../models/common/ILayout";

export interface IFiltersDefaultLayoutProperties extends ILayoutProps {
}

export class FiltersDefaultLayout extends BaseLayout<IFiltersDefaultLayoutProperties> {

    constructor(serviceScope: ServiceScope) {
        super(serviceScope);  
    }

    public getPropertyPaneFieldsConfiguration(availableFields: string[]): IPropertyPaneField<unknown>[] {
              
        return [
        ]
    }
}