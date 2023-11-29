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
    }
  }
}

declare module 'SearchVerticalsWebPartStrings' {
  const strings: ISearchVerticalsWebPartStrings;
  export = strings;
}
