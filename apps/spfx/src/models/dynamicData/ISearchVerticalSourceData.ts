import { IDataVerticalConfiguration } from "@pnp/modern-search-core/dist/es6/models/common/IDataVerticalConfiguration";

export interface ISearchVerticalSourceData {
    verticalsConfiguration: IDataVerticalConfiguration[];
    selectedVerticalKey: string;
}