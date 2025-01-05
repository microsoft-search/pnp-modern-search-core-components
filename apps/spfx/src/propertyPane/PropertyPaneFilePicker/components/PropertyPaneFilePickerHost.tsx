import * as React from "react";
import { IPropertyPaneFilePickerHostProps } from "./IPropertyPaneFilePickerHostProps";
import { IPropertyPaneFilePickerHostState } from "./IPropertyPaneFilePickerHostState";
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import { IconButton, Label, Stack, TextField, TooltipHost } from "office-ui-fabric-react";
import { isEqual } from "@microsoft/sp-lodash-subset";

const textFieldStyles = {
    root: {
        width: "100%",
    },
    fieldGroup: {   
        selectors: {
            "input:hover": {
                cursor: "pointer"
            }
        }
    }
};

const toolTipStyles = { 
    root: { 
        display: 'inline-block',
        width: "100%" 
    } 
}

export class PropertyPaneFilePickerHost extends React.Component<IPropertyPaneFilePickerHostProps, IPropertyPaneFilePickerHostState> {

    constructor(props: IPropertyPaneFilePickerHostProps) {
        super(props);

        this.state = {
            filePickerResult: props.filePickerResult,
            isPanelOpen: false
        };
    }

    public componentDidUpdate(prevProps: Readonly<IPropertyPaneFilePickerHostProps>): void {
        if (!isEqual(prevProps.filePickerResult, this.props.filePickerResult)) {
            this.setState({
                filePickerResult: this.props.filePickerResult
            });
        }
    }

    public render(): React.ReactNode {

        let renderTextField =   <TextField
                                    readOnly={true}
                                    styles={textFieldStyles}
                                    value={this.state.filePickerResult?.fileName}
                                    onClick={() => { 
                                        this.setState({isPanelOpen: true})
                                    }}
                                />;

        if (this.props.filePickerResult) {
            
            renderTextField =   <TooltipHost
                                        id={'filePickerResults'}
                                        content={this.props.filePickerResult?.fileAbsoluteUrl}
                                        calloutProps={{ gapSpace: 0 }}
                                        styles={toolTipStyles}
                                >
                                    <TextField
                                        readOnly={true}
                                        onClick={() => { 
                                            this.setState({isPanelOpen: true})
                                        }}
                                        styles={textFieldStyles}
                                        value={this.state.filePickerResult?.fileName}
                                        iconProps={{iconName: "Info"}}
                                    />
                                </TooltipHost>;
        }

        return  <>
                    <Label>{this.props.label}</Label>
                    <Stack horizontal verticalAlign={"center"} horizontalAlign={"space-between"} tokens={{childrenGap: 0}}>
                        {renderTextField}
                        <FilePicker 
                            context={this.props.componentContext}
                            accepts={["html","htm"]}
                            includePageLibraries={false}
                            buttonIcon={"FileHTML"}
                            checkIfFileExists={true}    
                            hidden={true}                        
                            allowExternalLinks={true}
                            hideStockImages={true}
                            hideWebSearchTab={true}
                            hideLocalUploadTab={true}
                            hideLocalMultipleUploadTab={true}
                            hideOrganisationalAssetTab={true}
                            isPanelOpen={this.state.isPanelOpen}
                            hideSiteFilesTab={false}
                            onCancel={() => {
                                this.setState({
                                    isPanelOpen: false
                                })
                            }}
                            onSave={((filePickerResult: IFilePickerResult[]) => {

                                this.setState({
                                    filePickerResult: filePickerResult[0],
                                    isPanelOpen: false
                                }, () => {
                                    this.props.onFileSelected(filePickerResult[0])
                                });
                                
                            })}
                        />
                        {this.props.filePickerResult?.fileName ? 
                            <IconButton 
                                iconProps={{iconName: "Cancel"}}
                                onClick={() => {
                                    
                                this.setState({
                                    filePickerResult: null,
                                    isPanelOpen: false
                                }, () => {
                                    this.props.onFileSelected(null)
                                });
                                }}
                            /> : null
                        }
                    </Stack>
                </>
    }
}