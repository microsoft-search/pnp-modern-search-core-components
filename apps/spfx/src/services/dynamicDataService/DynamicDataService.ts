import IDynamicDataService from "./IDynamicDataService";
import { DynamicDataProvider } from "@microsoft/sp-component-base";
import { IDynamicDataSource } from "@microsoft/sp-dynamic-data";
import { ServiceScope, ServiceKey } from "@microsoft/sp-core-library";
import IDynamicDataSourceProperty from "../../models/dynamicData/IDynamicDataSourceProperty";

const DynamicDataService_ServiceKey = 'PnPModernSearchDynamicDataService';

export class DynamicDataService implements IDynamicDataService {

    public static ServiceKey: ServiceKey<IDynamicDataService> = ServiceKey.create(DynamicDataService_ServiceKey, DynamicDataService);

    private _dynamicDataProvider: DynamicDataProvider;

    get dynamicDataProvider(): DynamicDataProvider {
        return this._dynamicDataProvider;
    }

    set dynamicDataProvider(value: DynamicDataProvider) {
        this._dynamicDataProvider = value;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(serviceScope: ServiceScope) {
    }

    /**
     * Get available data sources on the page with specific property Id (i.e. corresponding to the underlying component type)
     * @param propertyId The property id to look for to determine sources
     */
    public async getAvailableDataSourcesByType(propertyId: string): Promise<IDynamicDataSourceProperty[]> {
        
        const propertyOptions: IDynamicDataSourceProperty[] = [];

        if (!this.dynamicDataProvider.isDisposed) {
            this._dynamicDataProvider.getAvailableSources().forEach(async (sourceInfo) => {
                const source: IDynamicDataSource = this._dynamicDataProvider.tryGetSource(sourceInfo.id);
                if (source) {
                    const properties = await source.getPropertyDefinitionsAsync();
                    properties.forEach(prop => {
                        if (prop.id === propertyId) {
                            propertyOptions.push({
                                key: `${source.id}:${prop.id}`,
                                text: prop.title
                            });
                        }
                    });
                }
            });
        }
    
        return propertyOptions;
    }
    
}