import * as React from "react";
import * as commonStrings from "CommonStrings";

export interface IWebPartPlaceholderProps {
    description: string;
    documentationLink: string;
}

export default class WebPartPlaceholder extends React.Component<IWebPartPlaceholderProps, {}> {

    public render(): React.ReactElement<IWebPartPlaceholderProps> {

        return  <div className="flex justify-center p-5 flex-col items-center">
                    <img className="w-20" src={require("./logo.svg")} alt="PnP logo"/>
                    <p>{this.props.description}</p>
                    <a href={this.props.documentationLink}>{commonStrings.PropertyPane.InformationPage.Resources.Documentation}</a>
                </div>;
    }

}