
import { DynamicDataProvider } from "@microsoft/sp-component-base";
import IDynamicDataSourceProperty from "../../models/dynamicData/IDynamicDataSourceProperty";

export default interface IDynamicDataService {
    dynamicDataProvider: DynamicDataProvider;
    getAvailableDataSourcesByType(propertyId: string): Promise<IDynamicDataSourceProperty[]>;
}