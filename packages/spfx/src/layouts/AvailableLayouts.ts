/* eslint-disable @typescript-eslint/no-var-requires */
import { ILayoutDefinition, LayoutRenderType, LayoutType } from "../models/common/ILayoutDefinition";
import * as strings from 'CommonStrings';

export enum BuiltinLayoutsKeys {
    ResultsDefault = 'ResultsDefault',
    ResultsCustom = 'ResultsCustom',
    FiltersDefault = 'FiltersDefault',
    FiltersCustom = 'FiltersCustom'
}

export class AvailableLayouts {

    /**
     * Returns the list of builtin layouts for the Search Results
     */
    public static BuiltinLayouts: ILayoutDefinition[] = [
        {
            name: strings.Layouts.Default.Name,
            key: BuiltinLayoutsKeys.ResultsDefault.toString(),
            iconName: 'AppIconDefault',
            type: LayoutType.Results,
            templateContent: require('./results/simpleList/default.html'),
            renderType: LayoutRenderType.Html,
            serviceKey: null // ServiceKey will be created dynamically for builtin layout
        },
        {
            name: strings.Layouts.Custom.Name,
            key: BuiltinLayoutsKeys.ResultsCustom.toString(),
            iconName: 'CodeEdit',
            type: LayoutType.Results,
            templateContent: require('./results/custom/results-custom.html'),
            renderType: LayoutRenderType.Html,
            serviceKey: null // ServiceKey will be created dynamically for builtin layout
        },
        {
            name: strings.Layouts.Default.Name,
            key: BuiltinLayoutsKeys.FiltersDefault.toString(),
            iconName: 'AppIconDefault',
            type: LayoutType.Filters,
            templateContent: require('./filters/default/default.html'),
            renderType: LayoutRenderType.Html,
            serviceKey: null // ServiceKey will be created dynamically for builtin layout
        },
        {
            name: strings.Layouts.Custom.Name,
            key: BuiltinLayoutsKeys.FiltersCustom.toString(),
            iconName: 'CodeEdit',
            type: LayoutType.Filters,
            templateContent: require('./filters/custom/filters-custom.html'),
            renderType: LayoutRenderType.Html,
            serviceKey: null // ServiceKey will be created dynamically for builtin layout
        },
    
    ];
}