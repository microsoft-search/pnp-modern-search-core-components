import { IPropertyPaneField } from "@microsoft/sp-property-pane";
import { BaseLayout } from "../../../models/common/BaseLayout";
import { ServiceScope } from "@microsoft/sp-core-library";
import { ILayoutProps } from "../../../models/common/ILayout";

export interface IFiltersCustomLayoutProperties extends ILayoutProps {
}

export class FiltersCustomLayout extends BaseLayout<IFiltersCustomLayoutProperties> {

    constructor(serviceScope: ServiceScope) {
        super(serviceScope);  
    }

    public getPropertyPaneFieldsConfiguration(availableFields: string[]): IPropertyPaneField<unknown>[] {
              
        return [
        ]
    }
}