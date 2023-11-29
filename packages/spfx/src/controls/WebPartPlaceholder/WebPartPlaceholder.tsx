import * as React from "react";
import styles from "./WebPartPlaceholder.module.scss";

export interface IWebPartPlaceholderProps {
    description: string;
}

export default class WebPartPlaceholder extends React.Component<IWebPartPlaceholderProps, {}> {

    public render(): React.ReactElement<IWebPartPlaceholderProps> {

        return  <div className={styles.placeholderContainer}>
                    <img src={require("./logo.svg")} alt="PnP logo"/>
                    <p>{this.props.description}</p>
                </div>;
    }

}