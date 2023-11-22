import { ISortFieldConfiguration, SortFieldDirection } from "../../../../../models/common/ISortFieldConfiguration";

export const sortFieldsConfiguration: ISortFieldConfiguration[] = [
    {
      "sortField": "LastModifiedTime",
      "sortDirection": SortFieldDirection.Descending,
      "isDefaultSort": false,
      "isUserSort": true,
      "sortFieldDisplayName": {
        "fr-fr": "Date de modification",
        "default": "Last modified"
      }
    },  
    {
      "sortField": "Created",
      "sortDirection": SortFieldDirection.Ascending,
      "isDefaultSort": true,
      "isUserSort": true,
      "sortFieldDisplayName": {
        "fr-fr": "Date de création",
        "default": "Created"
      }
    }
];