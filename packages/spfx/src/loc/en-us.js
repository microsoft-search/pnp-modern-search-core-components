define([], function() {
    return {
        Tokens: {
            SelectTokenLabel: "Select a token...",
            Context: {
                ContextTokensGroupName: "Context tokens",
                SiteAbsoluteUrl: "Site absolute URL",
                SiteRelativeUrl: "Site server relative URL",
                WebAbsoluteUrl: "Web absolute URL",
                WebRelativeUrl: "Web server relative URL",
                WebTitle: "Web title",
                InputQueryText: "Input query text"
            },
            Custom: {
                CustomTokensGroupName: "Custom value",
                CustomValuePlaceholder: "Enter a value...",
                InvalidtokenFormatErrorMessage: "Please enter a supported token format using '{' and '}'. (ex: {Today})"
            },
            Date: {
                DateTokensGroupName: "Date tokens",
                Today: "Today",
                Yesterday: "Yesterday",
                Tomorrow: "Tomorrow",
                OneWeekAgo: "One week ago",
                OneMonthAgo: "One month ago",
                OneYearAgo: "One year ago"
            },
            Page: {
                PageTokensGroupName: "Page tokens",
                PageId: "Page ID",
                PageTitle: "Page Title",
                PageCustom: "Other page column",
            },
            User: {
                UserTokensGroupName: "User tokens",
                UserName: "User Name",
                Me: "Me",
                UserDepartment: "User Department",
                UserCustom: "User custom property"
            }
        },
        General: {
            SameTabOpenBehavior: "Use the current tab",
            NewTabOpenBehavior: "Open in a new tab",
            PageOpenBehaviorLabel: "Opening behavior",
        },
        PropertyPane: {
            ThemeSettingsGroupName: "Theme settings",
            ColorSettingsTabLabel: "Choose color",
            FollowSiteTheme: "Follow site theme",
            CustomColorsFieldName: "Custom colors",
            CustomColorsAddButtonLabel: "Add new custom color",
            BackgroundColorFieldName: "Background color",
            PrimaryColorFieldName: "Primary color",
            TextColorFieldName: "Text color",
            EditComponentTemplates: "Edit component template(s)",
            EnableDebugMode: "Debug mode",
            UseMicrosoftGraphToolkit: "Enable Microsoft Graph Toolkit",
            UseExternalTemplateFile: "Use external template file",
            TemplateSettingsGroupName: "Template(s) customization",
            InformationPage: {
                ImportExport: "Import/Export WebPart settings",
                About: "About",
                Authors: "Author(s)",
                Version: "Version",
                InstanceId: "Web Part instance ID",
                Resources: {
                    GroupName: "Resources",
                    Documentation: "📖 Read the documentation",
                    IssueLink: "🐞 Raise an issue",
                    PleaseReferToDocumentationMessage: "Please refer to the official documentation."
                },
                DeveloperSettingsWarning: "❗️❗️ This is a developer feature, make sure you know what are you doing ❗️❗️"
            },
            PropertyPaneFiltersConfiguration: {
                TextFieldErrorMessage: "Field must have a value",
                AggregationsErrorMessage: "All aggregations must have a name",
                FilterNameLabel: "Filter name",
                DisplayNameLabel: "Display name",
                TemplateLabel: "Template",
                CheckboxLabel: "Checkbox",
                DateLabel: "Date",
                SliderLabel: "Label",
                ShowCountLabel: "Show count",
                OperatorLabel: "Operator",
                IsMultiValue: "Is multi value",
                SortByLabel: "Sort by",
                ByCountLabel: "By count",
                ByNameLabel: "By name",
                SortDirectionLabel: "Sort direction",
                AscendingLabel: "Ascending",
                DescendingLabel: "Descending",
                NumberOfValuesLabel: "Number of values",
                Aggregations: {
                    TabTitle: "Aggregations",
                    AddBtnLabel: "Add new aggreagation",
                    RemoveBtnLabel: "Remove aggregation",
                    MatchingValuesLabel: "Matching values",
                    RegularExpressionLabel: "Regular expression",
                    AddNewValueBtnLabel: "Add new value",
                    AggregationValueLabel: "Aggregation value",
                    IconUrlLabel: "Icon URL"
                },
                SliderSettings: {
                    TabTitle: "Settings",
                    MinValueLabel: "Minimum value",
                    MinValueDescription: "The mininum value that can be selected on the slider",
                    MaxValueLabel: "Maximum value",
                    MaxValueDescription: "The maximum value that can be selected on the slider",
                    DefaultMinLabel: "Default minimum value",
                    DefaultMinDescription: "The default mininum value selected on the slider",
                    DefaultMaxLabel: "Default maximum value",
                    DefaultMaxDescription: "The default maximum value selected on the slider",
                    Markers: {
                        MarkersTitle: "Markers",
                        AddBtnLabel: "Add new marker",
                        RemoveBtnLabel: "Remove marker",
                        MarkerLabelLabel: "Label",
                        MarkerLabelDescription: "Label to display on the marker. Can be null.",
                        MarkerValueLabel: "Value",
                        MarkerValueDescription: "Value of the marker. Should falls between min and max values",
                        SizeLabel: "Size",
                        SizeDescription: "Label size in px"
                    }
                },
                DisplaySettings: {
                    TabTitle: "Display",
                    SelectTabLabel: "Show this filter on selected tabs",
                    PlaceholderLabel: "Select a tab..."
                },
                AddNewFilterBtnLabel: "Add new filter"
                

            }
        },
        Controls: {
        },
        Layouts: {
            Debug: {
                Name: "Debug"
            },
            Default: {
                Name: "Default"
            },
            Custom: {
                Name: "Custom"
            },
            ResultsTiles: {
                ContainerWidthOptionsFieldLabel: "WebPart widths",
                ContainerWidthFieldLabel: "WebPart container width",
                SmallWidth: "Small (Less than	384px)",
                MediumWidth: "Medium (from 384px to 448px)",
                LargeWidth:  "Large (from 448px to 512px)",
                ExtraLargeWidth: "Extra Large (from 512px to 576px)",
                ExtraExtraLargeWidth: "Extra Extra Large (more than 576px)",
            }
        }
    }
})
