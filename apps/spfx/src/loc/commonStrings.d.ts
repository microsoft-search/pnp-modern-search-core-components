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
        IssueLink: string;
        PleaseReferToDocumentationMessage: string;
      },
      DeveloperSettingsWarning: string;
    },
    PropertyPaneFiltersConfiguration: {
      TextFieldErrorMessage: string;
      AggregationsErrorMessage: string;
      FilterNameLabel: string;
      DisplayNameLabel: string;
      TemplateLabel: string;
      CheckboxLabel: string;
      DateLabel: string;
      SliderLabel: string;
      ShowCountLabel: string;
      OperatorLabel: string;
      IsMultiValue: string;
      SortByLabel: string;
      ByCountLabel: string;
      ByNameLabel: string;
      SortDirectionLabel: string;
      AscendingLabel: string;
      DescendingLabel: string;
      NumberOfValuesLabel: string;
      Aggregations: {
          TabTitle: string;
          AddBtnLabel: string;
          RemoveBtnLabel: string;
          MatchingValuesLabel: string;
          RegularExpressionLabel: string;
          AddNewValueBtnLabel: string;
          AggregationValueLabel: string;
          IconUrlLabel: string;
      },
      SliderSettings: {
          TabTitle: string;
          MinValueLabel: string;
          MinValueDescription: string;
          MaxValueLabel: string;
          MaxValueDescription: string;
          DefaultMinLabel: string;
          DefaultMinDescription: string;
          DefaultMaxLabel: string;
          DefaultMaxDescription: string;
          Markers: {
              MarkersTitle: string;
              AddBtnLabel: string;
              RemoveBtnLabel: string;
              MarkerLabelLabel: string;
              MarkerLabelDescription: string;
              MarkerValueLabel: string;
              MarkerValueDescription: string;
              SizeLabel: string;
              SizeDescription: string;
          }
      },
      DisplaySettings: {
          TabTitle: string;
          SelectTabLabel: string;
          PlaceholderLabel: string;
      },
      AddNewFilterBtnLabel: string;
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
