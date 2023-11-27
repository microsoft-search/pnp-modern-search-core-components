import * as React from "react";
import { ILocalizedFieldProps } from "./ILocalizedFieldProps";
import { ILocalizedFieldState } from "./ILocalizedFieldState";
import { IDropdownOption, TextField } from "office-ui-fabric-react";
import styles from "./LocalizedTextField.module.scss"
import { Guid } from "@microsoft/sp-core-library";
import { TranslationField } from "./components/TranslationField";
import { ILocalizedString } from "pnp-modern-search-core/dist/es6/models/common/ILocalizedString";
import { LocalizedStringHelper } from "pnp-modern-search-core/dist/es6/helpers/LocalizedStringHelper";
import { ILocalizationService } from "../../services/localizationService/ILocalizationService";
import { LocalizationService } from "../../services/localizationService/LocalizationService";
import { PageContext } from "@microsoft/sp-page-context";
import { ITranslation } from "./components/ITranslation";

import { ConfigurationFieldType } from "../ConfigurationPanel/IConfigurationTabField";
import { FormDataCollection } from "../FormDataCollection/FormDataCollection";

export class LocalizedField extends React.Component<ILocalizedFieldProps, ILocalizedFieldState> {

    private localizationService: ILocalizationService;
    private pageContext: PageContext;

    /**
     * The list of all available locales in the site
     */
    private availableLocales: IDropdownOption[] = [];

    constructor(props: ILocalizedFieldProps) {

        super(props);

        this.state = {
            defaultTranslation: null,
            fieldValue: null,
            additionalTranslations: [],
            stateKey: null
        };

        this.onDefaultTranslationUpdated = this.onDefaultTranslationUpdated.bind(this);
        this.onAdditionalTranslationsUpdated = this.onAdditionalTranslationsUpdated.bind(this);

        this.props.serviceScope.whenFinished(() => {
            this.localizationService = this.props.serviceScope.consume<ILocalizationService>(LocalizationService.ServiceKey);
            this.pageContext = this.props.serviceScope.consume<PageContext>(PageContext.serviceKey);
        });
    }

    public async componentDidMount(): Promise<void> {

        await this.initSupportedLanguages();
        this.initializeState();
    }

    private initializeState(): void {

        if (LocalizedStringHelper.isLocalizedString(this.props.defaultValue)) {

            const translationFieldValues: ITranslation[] = this.getTranslations(this.props.defaultValue as ILocalizedString);
          
            this.setState({
                defaultTranslation: (this.props.defaultValue as ILocalizedString).default,
                additionalTranslations: translationFieldValues,
                stateKey: Guid.newGuid().toString() // Used to force recreating item repeater rows from initialized items
            });

        } else {

            this.setState({
                defaultTranslation: this.props.defaultValue as string
            });
        }
    }

    public render(): React.ReactNode {

        let defaultTranslationValue: string;
        const disabled: boolean = this.availableLocales && !this.availableLocales.some(locale => !this.state.additionalTranslations.some(t => t.locale === locale.key));
                                  
        if (LocalizedStringHelper.isLocalizedString(this.props.defaultValue)) {
            defaultTranslationValue = (this.props.defaultValue as ILocalizedString).default;
        } else {
            defaultTranslationValue = this.props.defaultValue as string;
        }

        const disabledLocales = this.state.additionalTranslations.map(t => t.locale);
        const renderLanguages = <FormDataCollection<ITranslation>
                                    stateKey={this.state.stateKey}
                                    items={this.state.additionalTranslations}
                                    itemRepeaterProps={{
                                        disabled: disabled,
                                        addButtonLabel: "Add new translation"
                                    }}
                                    formConfiguration={[
                                        {
                                            type: ConfigurationFieldType.Custom,
                                            targetProperty: null,
                                            onCustomRender: (field, defaultValue, onUpdate) => {
                                                return  <TranslationField
                                                            disabledLocales={disabledLocales}
                                                            supportedLocales={this.availableLocales}
                                                            defaultValue={defaultValue}
                                                            onChange={(value: ITranslation) => {
                                                                onUpdate(field, value);
                                                            }} 
                                                        />;
                                            }
                                        }
                                    ]}
                                    newRowDefaultObject={() => {
                                        return {
                                            locale: "",
                                            value: ""
                                        }
                                    }}
                                    onChange={this.onAdditionalTranslationsUpdated}
                                />;

        const renderControl =   <div>
                                    <div className={styles.fieldContainer}>
                                        <TextField
                                            onGetErrorMessage={this.props.onGetErrorMessage}
                                            required={this.props.required}
                                            prefix={this.pageContext.cultureInfo.currentCultureName.toLocaleLowerCase()}
                                            label={this.props.label}
                                            defaultValue={defaultTranslationValue}
                                            styles={
                                                {
                                                    prefix:{
                                                        minWidth: 60,
                                                    },
                                                    root: {
                                                        width: "100%"
                                                    }
                                                }
                                            } 
                                            iconProps={{ iconName: "LocaleLanguage"}}
                                            onChange={this.onDefaultTranslationUpdated}                                        
                                        />
                                    </div>
                                    <div className={styles.languagesContainer}>
                                        {renderLanguages}
                                    </div>
                                </div>;

        return renderControl;
        
    }

    private onDefaultTranslationUpdated(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void {
       
        let fieldValue: string | ILocalizedString = newValue;

        if (this.state.additionalTranslations.length > 0) {
            fieldValue = this.toLocalizedString(newValue, this.state.additionalTranslations);
        }

        this.setState({
            defaultTranslation: newValue,
            fieldValue: fieldValue
        });

        this.props.onChange(fieldValue);
    }

    private onAdditionalTranslationsUpdated(translations: ITranslation[]): void {

        let fieldValue: string | ILocalizedString = this.state.defaultTranslation;

        if (translations.length > 0) {
            fieldValue = this.toLocalizedString(this.state.defaultTranslation, translations);
        }                         
        
        this.setState({
            additionalTranslations: translations,
            fieldValue: fieldValue 
        });

        this.props.onChange(fieldValue);
    }

    private async initSupportedLanguages(): Promise<void> {
        const supportedLocales = await this.localizationService.getSiteSupportedLocales();
        this.availableLocales = supportedLocales.map(locale => { 
            return {
                key: locale,
                text: locale,
                disabled: false
            };
        });
    }

    private toLocalizedString(defaultTranslation: string, otherTranslations: ITranslation[]): ILocalizedString {

        let localizedStrings = {};
        [...otherTranslations].forEach(translation => {
            localizedStrings = Object.assign(localizedStrings, { [translation.locale]: translation.value })
        });

        return {
            default: defaultTranslation,
            ...localizedStrings
        }
    }

    private getTranslations(localizedString: ILocalizedString): ITranslation[] {
        
        return Object.keys(localizedString).filter(k => k !== 'default').map(key => {
            
            return {
                locale: key,
                value: localizedString[key]
            };
        });

    }
}