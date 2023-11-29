import * as React from "react";
import { ITranslationFieldState } from "./ITranslationFieldState";
import { ComboBox, IComboBox, IComboBoxOption, TextField } from "office-ui-fabric-react";
import styles from "../LocalizedTextField.module.scss";
import { ITranslationFieldProps } from "./ITranslationFieldProps";

//#region Fluent UI styles 
const comboBoxStyles = {
    container: {
        maxWidth: 80,
    }
};

const textFieldStyles = {
    wrapper: {
        borderLeft: "none"
    }
};
//#endregion

export class TranslationField extends React.Component<ITranslationFieldProps, ITranslationFieldState> {

    constructor(props: ITranslationFieldProps) {

        super(props);

        this.state = {
            translation: {
                locale: null,
                value: null
            }
        };

        this.onResolveOptions = this.onResolveOptions.bind(this);
        this.onLocaleChange = this.onLocaleChange.bind(this);
        this.onTranslationValueChange = this.onTranslationValueChange.bind(this);
    }

    public componentDidMount(): void {
        
        if (this.props.defaultValue) {
            this.setState({
                translation: this.props.defaultValue
            });
        }
    }
    
    public render(): React.ReactNode {

        return  <div className={styles.translationContainer}>
                    <ComboBox
                        defaultSelectedKey={this.props.defaultValue ? this.props.defaultValue.locale : null}
                        options={this.props.supportedLocales} 
                        onResolveOptions={this.onResolveOptions}
                        styles={comboBoxStyles}
                        onChange={this.onLocaleChange}  
                    />
                    <TextField
                        defaultValue={this.props.defaultValue ? this.props.defaultValue.value : null}
                        styles={textFieldStyles}
                        onChange={this.onTranslationValueChange}
                    />
                </div>;
    }

    private onResolveOptions(options: IComboBoxOption[]): IComboBoxOption[] {

        if (this.props.disabledLocales && this.props.disabledLocales.length > 0) {
            return options.map(option => {
                option.disabled = this.props.disabledLocales.indexOf(option.key as string) !== -1;
                return option;
            });
        }

        return options;
    }

    private onLocaleChange(event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void {

        this.setState({
            translation: {
                locale: option.key as string,
                value: this.state.translation.value
            }
        });

        if (option.key && this.state.translation.value) {
            this.props.onChange(this.state.translation);
        }
    }

    private onTranslationValueChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void {

        const updatedTranslation = {
            locale: this.state.translation.locale,
            value: newValue
        };

        this.setState({
            translation: updatedTranslation
        });

        if (this.state.translation.locale && newValue) {
            this.props.onChange(updatedTranslation);
        }
    }
}