declare interface ISearchVerticalsWebPartStrings {
  General: {
    PlaceHolder: {
        EditLabel: string;
        IconText: string;
        Description: string;
        ConfigureBtnLabel: string;
    },
    WebPartDefaultTitle: string;
  },
  PropertyPane: {
    SettingsPage: {
      VerticalSettingsGroupName: string;
    },
    VerticalConfigurationPane: {
      VerticalsLabel: string;
      Title: string;
      VerticalName: string;
      VerticalKey: string;
      VerticalValue: string;
      IsLink: string;
      LinkUrl: string;
      OpenBehavior: string;
      NewTabOption: string;
      SelfTabOption: string;
    }
  }
}

declare module 'SearchVerticalsWebPartStrings' {
  const strings: ISearchVerticalsWebPartStrings;
  export = strings;
}
