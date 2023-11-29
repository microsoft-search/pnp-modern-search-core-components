import * as React from "react";
import { IPropertyPaneCodeEditorHostProps } from "./IPropertyPaneCodeEditorHostProps";
import { Editor, loader } from "@monaco-editor/react/dist/index.js";
import { DefaultButton, IconButton, Label, Panel, PanelType, PrimaryButton, Stack, TextField } from "office-ui-fabric-react";
import { IPropertyPaneCodeEditorHostState } from "./IPropertyPaneCodeEditorHostState";
import styles from "../../../controls/ConfigurationPanel/ConfigurationPanel.module.scss";
import { isEqual } from "@microsoft/sp-lodash-subset";

export class PropertyPaneCodeEditorHost extends React.Component<IPropertyPaneCodeEditorHostProps, IPropertyPaneCodeEditorHostState> {
    
    constructor(props: IPropertyPaneCodeEditorHostProps) {
        super(props);

        this.state = {
            isOpen: false,
            value: props.defaultValue
        };

        loader.config({ paths: {
            vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.41.0/min/vs" // Use the same version as the web component to benefit from the cache
        }});

        this.togglePanel = this.togglePanel.bind(this);

    }

    public render(): React.ReactNode {

        const renderFooter =    <div className={styles.footerContainer}>
                                    <div className={styles.buttonContainer}>
                                        <PrimaryButton 
                                            onClick={() => {
                                                this.props.onValueChange(this.state.value);
                                                this.togglePanel();
                                            }}
                                            disabled={isEqual(this.props.defaultValue, this.state.value)}
                                        >Save</PrimaryButton>
                                        <DefaultButton onClick={this.togglePanel}>Cancel</DefaultButton>
                                    </div>
                                </div>;

        return  <>  
                    <Label>{this.props.label}</Label>
                    <Stack horizontal={true} >
                        <TextField
                            readOnly={true}
                            disabled={this.props.isReadOnly}
                            value={this.state.value}
                            onClick={this.togglePanel}
                            styles={{root: {width: '100%'}}}
                        />
                        <IconButton iconProps={{ iconName: 'Code' }} onClick={this.togglePanel} />
                    </Stack>
                    <Panel
                        isOpen={this.state.isOpen}
                        onDismiss={this.togglePanel}
                        isLightDismiss={true}
                        type={PanelType.large}
                        isFooterAtBottom={true}
                        styles={{
                            content: {
                            height: '100%',
                            width: '100%',
                            boxSizing: 'border-box'
                            }
                        }}
                        onRenderFooterContent={() => {return renderFooter}}
                    >
                        <Editor
                            height="90vh"
                            options={{
                                readOnly: this.props.isReadOnly
                            }}
                            defaultLanguage="html"
                            defaultValue={this.props.defaultValue}
                            onChange={(value: string | undefined) => {
                                this.setState({
                                    value: value
                                })
                            }}
                            theme={this.props.theme?.isInverted ? "vs-dark" : "vs"}
                        />
                    </Panel>
                    
                </>
    }

    public componentDidUpdate(prevProps: Readonly<IPropertyPaneCodeEditorHostProps>): void {
        if (!isEqual(prevProps.defaultValue, this.props.defaultValue)) {
            this.setState({
                value: this.props.defaultValue
            });
        }
    }

    public togglePanel(): void {

        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}