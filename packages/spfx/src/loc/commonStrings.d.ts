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
    UseExternalTemplateFile: string;
    TemplateSettingsGroupName: string;
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
      }
  }
}

declare module 'CommonStrings' {
  const strings: ICommonStrings;
  export = strings;
}
