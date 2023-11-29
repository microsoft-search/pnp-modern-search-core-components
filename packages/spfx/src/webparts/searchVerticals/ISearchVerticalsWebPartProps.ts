import { IDataVerticalConfiguration } from "pnp-modern-search-core/dist/es6/models/common/IDataVerticalConfiguration";
import { IBaseWebPartProps } from "../../models/common/IBaseWebPartProps";

export interface ISearchVerticalsWebPartProps extends IBaseWebPartProps {
    verticalConfiguration: IDataVerticalConfiguration[];
}