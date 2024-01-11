import * as React from "react";

export interface IWebPartPlaceholderProps {
    description: string;
}

export default class WebPartPlaceholder extends React.Component<IWebPartPlaceholderProps, {}> {

    public render(): React.ReactElement<IWebPartPlaceholderProps> {

        return  <div className="flex justify-center p-5 flex-col items-center">
                    <img className="w-20" src={require("./logo.svg")} alt="PnP logo"/>
                    <p>{this.props.description}</p>
                </div>;
    }

}