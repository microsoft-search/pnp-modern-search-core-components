/* eslint-disable @typescript-eslint/no-var-requires */
import { ILayoutDefinition, LayoutRenderType, LayoutType } from "../models/common/ILayoutDefinition";
import * as strings from 'CommonStrings';

export enum BuiltinLayoutsKeys {
    ResultsDefault = 'ResultsDefault',
    ResultsCustom = 'ResultsCustom',
    ResultsTiles = 'ResultsTiles',
    FiltersDefault = 'FiltersDefault',
    FiltersCustom = 'FiltersCustom',
    VerticalsDefault = 'VerticalsDefault',
    VerticalsCustom = 'VerticalsCustom'
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
            name: "Tiles",
            key: BuiltinLayoutsKeys.ResultsTiles.toString(),
            iconName: 'Tiles',
            type: LayoutType.Results,
            templateContent: require('./results/tiles/results-tiles.html'),
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
        {
            name: strings.Layouts.Default.Name,
            key: BuiltinLayoutsKeys.VerticalsDefault.toString(),
            iconName: 'AppIconDefault',
            type: LayoutType.Verticals,
            templateContent: require('./verticals/default/default.html'),
            renderType: LayoutRenderType.Html,
            serviceKey: null // ServiceKey will be created dynamically for builtin layout
        },
        {
            name: strings.Layouts.Custom.Name,
            key: BuiltinLayoutsKeys.VerticalsCustom.toString(),
            iconName: 'CodeEdit',
            type: LayoutType.Verticals,
            templateContent: require('./verticals/custom/verticals-custom.html'),
            renderType: LayoutRenderType.Html,
            serviceKey: null // ServiceKey will be created dynamically for builtin layout
        }
    ];
}