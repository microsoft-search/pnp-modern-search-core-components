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
            TemplateSettingsGroupName: "Template settings",
            InformationPage: {
                ImportExport: "Import/Export WebPart settings",
                About: "About",
                Authors: "Author(s)",
                Version: "Version",
                InstanceId: "Web Part instance ID",
                Resources: {
                    GroupName: "Resources",
                    Documentation: "Read the documentation",
                    PleaseReferToDocumentationMessage: "Please refer to the official documentation."
                },
                DeveloperSettingsWarning: "❗️❗️ This is a developer feature, make sure you know what are you doing ❗️❗️"
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
