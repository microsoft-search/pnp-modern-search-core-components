import { ServiceScope } from "@microsoft/sp-core-library";
import { IDataFilterConfiguration } from "pnp-modern-search-core/dist/es6/models/common/IDataFilterConfiguration";
import { IDataVerticalConfiguration } from "pnp-modern-search-core/dist/es6/models/common/IDataVerticalConfiguration";

export interface IPropertyPaneFiltersConfigurationProps {
    serviceScope: ServiceScope;
    defaultValue: IDataFilterConfiguration[];
    verticalsConfiguration?: IDataVerticalConfiguration[]
}