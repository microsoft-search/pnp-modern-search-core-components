
import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import { ServiceScopeHelper } from './ServiceScopeHelper';
import { IPropertyPaneChoiceGroupOption, IPropertyPaneField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BuiltinLayoutsKeys } from '../layouts/AvailableLayouts';
import { ILayout } from '../models/common/ILayout';
import { ILayoutDefinition } from '../models/common/ILayoutDefinition';
import { ILayoutSlot } from '../models/common/ILayoutSlot';
import { IBaseWebPartProps } from '../models/common/IBaseWebPartProps';

export class LayoutHelper {

    /**
     * Gets the layout instance according to the current selected one
     * @param rootScope the root service scope
     * @param context the Web Part context
     * @param properties the web part properties (only supported Web Parts)
     * @param layoutKey the selected layout key
     * @param layoutDefinitions the available layout definitions
     * @returns the data source provider instance
     */
    public static async getLayoutInstance(rootScope: ServiceScope, context: WebPartContext, properties: IBaseWebPartProps, layoutKey: string, layoutDefinitions: ILayoutDefinition[]): Promise<ILayout> {

        let layout: ILayout = undefined;
        let serviceKey: ServiceKey<ILayout> = undefined;

        if (layoutKey) {

            // If it is a builtin layout, we load the corresponding known class file asynchronously for performance purpose
            // We also create the service key at the same time to be able to get an instance
            switch (layoutKey) {

                // Results Default
                case BuiltinLayoutsKeys.ResultsDefault:  {

                    const { ResultsDefaultLayout } = await import(
                        /* webpackChunkName: 'pnp-modern-search-core-results-list-layout' */
                        '../layouts/results/simpleList/ResultsDefaultLayout'
                    );

                    serviceKey = ServiceKey.create<ILayout>('ModernSearchCoreResultsDefaultLayout', ResultsDefaultLayout);
                    break;
                }

                // Results Custom
                case BuiltinLayoutsKeys.ResultsCustom: {

                    const { ResultsCustomLayout } = await import(
                        /* webpackChunkName: 'pnp-modern-search-core-results-custom-layout' */
                        '../layouts/results/custom/ResultsCustomLayout'
                    );

                    serviceKey = ServiceKey.create<ILayout>('ModernSearchCoreResultsCustomLayout', ResultsCustomLayout);
                    break;
                }

                // Filters Default
                case BuiltinLayoutsKeys.FiltersDefault: {

                    const { FiltersDefaultLayout } = await import(
                        /* webpackChunkName: 'pnp-modern-search-core-filters-default-layout' */
                        '../layouts/filters/default/FiltersDefaultLayout'
                    );

                    serviceKey = ServiceKey.create<ILayout>('ModernSearchCoreFiltersDefaultLayout', FiltersDefaultLayout);
                    break;
                }

                // Filters Custom
                case BuiltinLayoutsKeys.FiltersCustom: {

                    const { FiltersCustomLayout } = await import(
                        /* webpackChunkName: 'pnp-modern-search-core-filters-custom-layout' */
                        '../layouts/filters/custom/FiltersCustomLayout'
                    );

                    serviceKey = ServiceKey.create<ILayout>('ModernSearchCoreFiltersCustomLayout', FiltersCustomLayout);
                    break;
                }
            }

            return new Promise<ILayout>((resolve, reject) => {

                // Register the layout service in the Web Part scope only (child scope of the current scope)
                const childServiceScope = ServiceScopeHelper.registerChildServices(rootScope, [serviceKey]);

                childServiceScope.whenFinished(async () => {

                    layout = childServiceScope.consume<ILayout>(serviceKey);

                    // Initialize the layout with current Web Part properties
                    if (layout) {
                        layout.properties = properties.layoutProperties; // Web Parts using layouts must define this sub property
                        layout.context = context;
                        await layout.onInit();
                        resolve(layout);
                    }
                });
            });
        }
    }

    /**
     * Builds the layout options list from available layouts
     */
    public static getLayoutOptions(availableLayoutDefinitions: ILayoutDefinition[]): IPropertyPaneChoiceGroupOption[] {

        const layoutOptions: IPropertyPaneChoiceGroupOption[] = [];
        
        availableLayoutDefinitions.forEach((layout) => {
            layoutOptions.push({
                iconProps: {
                    officeFabricIconFontName: layout.iconName
                },
                imageSize: {
                    width: 200,
                    height: 100
                },
                key: layout.key,
                text: layout.name,
            });
        });

        return layoutOptions;
    }

    /**
     * Converts the configured template slots to an hashtable to be used in the Handlebars templates
     * @param templateSlots the configured template slots
     */
    public static convertTemplateSlotsToHashtable(layoutSlots: ILayoutSlot[]): { [key: string]: string } {

        // Transform the slots as an hashtable for the HB templates (easier to manipulate rather than a full object)
        const slots: { [key: string]: string } = {};

        if (layoutSlots) {
            layoutSlots.forEach(layoutSlot => {
                slots[layoutSlot.slotName] = layoutSlot.slotValue;
            });
        }

        return slots;
    }

    public static getCommonLayoutsOptionFields<T>(properties: T): IPropertyPaneField<unknown>[] {
        
        const commonFields: IPropertyPaneField<unknown>[] = [
            PropertyPaneToggle('showResultsCount', {
              label: "Show result count",
            })
        ];

        return commonFields;
    }
}