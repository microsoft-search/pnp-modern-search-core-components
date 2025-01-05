import { IDataVerticalConfiguration } from "@pnp/modern-search-core/dist/es6/models/common/IDataVerticalConfiguration";
import { IBaseWebComponentWrapperProps } from "../../../models/common/IBaseWebComponentWrapper";

export interface ISearchVerticalsProps extends IBaseWebComponentWrapperProps {

    /**
     * The verticals configuration
     */
    verticalConfiguration: IDataVerticalConfiguration[];

    /**
     * Handler when a vertica ltab is selected
     * @param selectedKey the current selected vertical key
     */
    onVerticalSelected?: (selectedKey: string) => void;
}
