import * as React from "react";
import { IConfigurationPanelProps } from "./IConfigurationPanelProps";
import { IConfigurationPanelState } from "./IConfigurationPanelState";
import { DefaultButton, IconButton, Label, Panel, Pivot, PivotItem, PrimaryButton } from "office-ui-fabric-react";
import { FormBuilder } from "../FormBuilder/FormBuilder";
import { cloneDeep, isEqual } from "@microsoft/sp-lodash-subset";
import { IConfigurationTab } from "./IConfigurationTab";

export class ConfigurationPanel<T> extends React.Component<IConfigurationPanelProps<T>,IConfigurationPanelState<T>> {
    
    constructor(props: IConfigurationPanelProps<T>) {
        super(props);

        this.state = {
            isOpen: false,
            currentformData: null,
            savedformData: null,
            title: null,
            canSave: false,
            errors: new Map<string, Map<string,string>>()
        };

        this.togglePanel = this.togglePanel.bind(this);
        this.onFormValuesUpdated = this.onFormValuesUpdated.bind(this);
        this.onFormDismissed = this.onFormDismissed.bind(this);
    }

    public componentDidMount(): void {

        this.setState({
            savedformData: {...this.props.dataObject},
            currentformData: {...this.props.dataObject},
            title: this.props.renderRowTitle(this.props.dataObject)
        });
    }

    public render(): React.ReactNode {

        const renderFooter =    <div className="flex pl-6 justify-end">
                                    <div className="flex space-x-2">
                                        <PrimaryButton 
                                            onClick={() => {
                                                this.setState({
                                                    canSave: false,
                                                    savedformData: {...this.state.currentformData}
                                                });

                                                this.props.onFormSave(this.state.currentformData);
                                                this.togglePanel();
                                            }}
                                            disabled={!this.state.canSave}
                                        >Save</PrimaryButton>
                                        <DefaultButton onClick={this.onFormDismissed}>Cancel</DefaultButton>
                                    </div>
                                </div>;

        
        const renderTabs = this.props.configurationTabs.filter(tab => !tab.isVisible || (tab.isVisible && this.state.currentformData && tab.isVisible(this.state.currentformData))).map((tab, i) => {
            
            return  <PivotItem
                        key={tab.name}
                        headerText={tab.name}                    
                    >
                        <div className="p-2" >
                            <FormBuilder 
                                key={i}
                                dataObject={this.state.currentformData}
                                fields={tab.fields}
                                onFormValuesUpdated={(formData: T, errors: Map<string,string>) => {
                                    this.onFormValuesUpdated(tab, formData, errors);
                                    this.forceUpdate();
                                }}
                            />
                        </div>
                    </PivotItem>
        });

        return  <>
                    <div className="flex justify-between pl-1">
                        <Label>{this.state.title}</Label>
                        <IconButton iconProps={{ iconName: 'Edit' }} onClick={this.togglePanel}/>
                    </div>
                    <Panel 
                        headerText={this.props.renderPanelTitle(this.props.dataObject)}
                        isOpen={this.state.isOpen}
                        onDismiss={this.onFormDismissed}
                        isFooterAtBottom={true}
                        onRenderFooterContent={(props) => {
                            return renderFooter;
                        }}
                    >
                        <Pivot>
                            {renderTabs}
                        </Pivot>
                    </Panel>
                </>   
    }

    public togglePanel(): void {

        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    private onFormDismissed(): void {
        
        // Revert back to original form values
        this.setState({
            currentformData: {...this.state.savedformData},
            canSave: false
        });

        if (this.props.onFormDismissed) {
            this.props.onFormDismissed(this.state.savedformData);
        }

        this.togglePanel();
    }

    private onFormValuesUpdated(tab: IConfigurationTab, formData: T, errors: Map<string,string>): void {

        const title = this.props.renderRowTitle(formData);

        // Update errors list from all tabs
        const tabErrors = cloneDeep(this.state.errors);
        if (errors.size === 0) {
            if (tabErrors.get(tab.name))
                tabErrors.delete(tab.name);
        } else {
            tabErrors.set(tab.name, errors);
        }

        // Merge form data from all tabs
        const mergedFormDataFromTabs = {...this.state.currentformData,...formData};

        // Compare updates from saved input data
        const canSave = !isEqual(this.state.savedformData, mergedFormDataFromTabs) && !(tabErrors.size > 0);
 
        this.setState({ 
            currentformData: mergedFormDataFromTabs,
            title: title,
            canSave: canSave,
            errors: tabErrors
        });
    }
}
