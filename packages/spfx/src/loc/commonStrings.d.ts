declare interface ICommonStrings {
  Tokens: {
    SelectTokenLabel: string;
    Context: {
      ContextTokensGroupName: string;
      SiteAbsoluteUrl: string;
      SiteRelativeUrl: string;
      WebAbsoluteUrl: string;
      WebRelativeUrl: string;
      WebTitle: string;
      InputQueryText: string;
    },
    Custom: {
      CustomTokensGroupName: string;
      CustomValuePlaceholder: string;
      InvalidtokenFormatErrorMessage: string;
    },
    Date: {
      DateTokensGroupName: string;
      Today: string;
      Yesterday: string;
      Tomorrow: string;
      OneWeekAgo: string;
      OneMonthAgo: string;
      OneYearAgo: string;
    },
    Page: {
      PageTokensGroupName: string;
      PageId: string;
      PageTitle: string;
      PageCustom: string;
    },
    User: {
      UserTokensGroupName: string;
      UserName: string;
      Me: string;
      UserDepartment: string;
      UserCustom: string;
    }
  },
  General: {
    SameTabOpenBehavior: string;
    NewTabOpenBehavior: string;
    PageOpenBehaviorLabel: string;
  },
  PropertyPane: {
    ThemeSettingsGroupName: string;
    ColorSettingsTabLabel: string;
    FollowSiteTheme: string;
    CustomColorsFieldName: string;
    CustomColorsAddButtonLabel: string;
    PrimaryColorFieldName: string;
    BackgroundColorFieldName: string;
    TextColorFieldName: string;
    EditComponentTemplates: string;
    EnableDebugMode: string;
    UseMicrosoftGraphToolkit: string;
    UseExternalTemplateFile: string;
    TemplateSettingsGroupName: string;
    InformationPage: {
      ImportExport: string;
      Version: string;
      InstanceId: string;
      About: string;
      Authors: string;
      Resources: {
        GroupName: string;
        Documentation: string;
        PleaseReferToDocumentationMessage: string;
      },
      DeveloperSettingsWarning: string;
    }
  },
  Controls: {
  },
  Layouts: {
      Debug: {
          Name: string;
      },
      Default: {
          Name: string;
      },
      Custom: {
        Name: string;
      },
      ResultsTiles: {
        ContainerWidthOptionsFieldLabel: string;
        ContainerWidthFieldLabel: string;
        SmallWidth: string;
        MediumWidth: string;
        LargeWidth: string;
        ExtraLargeWidth: string;
        ExtraExtraLargeWidth: string;
      }
  }
}

declare module 'CommonStrings' {
  const strings: ICommonStrings;
  export = strings;
}
