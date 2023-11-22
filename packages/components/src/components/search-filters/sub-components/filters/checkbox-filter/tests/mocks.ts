import { BuiltinFilterTemplates } from "../../../../../../models/common/BuiltinTemplate";
import { IDataFilterResult, FilterConditionOperator } from "../../../../../../models/common/IDataFilter";
import { IDataFilterConfiguration, FilterSortType, FilterSortDirection } from "../../../../../../models/common/IDataFilterConfiguration";

//#region Mock data
export const basefilterResults: IDataFilterResult = {
    "filterName":"FileType",
    "values":[
      {
        "key":"\"ǂǂ646f6378\"",
        "count": 100,
        "name":"docx",
        "value":"\"ǂǂ646f6378\"",
        "operator": 6
      },
      {
        "key":"\"ǂǂ70707478\"",
        "count": 50,
        "name":"pptx",
        "value":"\"ǂǂ70707478\"",
        "operator": 6
      },
      {
        "key":"\"ǂǂ706466\"",
        "count": 25,
        "name":"pdf",
        "value":"\"ǂǂ706466\"",
        "operator": 6
      }
    ]
};

export const baseFilterConfiguration: IDataFilterConfiguration =  {
    filterName: "FileType",
    template: BuiltinFilterTemplates.CheckBox,
    displayName: "File type",
    showCount: true,
    operator: FilterConditionOperator.OR,
    isMulti: false,
    sortBy: FilterSortType.ByName,
    sortDirection: FilterSortDirection.Descending,
    maxBuckets: 50,
    sortIdx: 0
};

export const aggregatedFilterResults: IDataFilterResult = {
    "filterName":"FileType",
    "values":[
        {
        "key":"\"ǂǂ646f6378\"",
        "count": 100,
        "name":"docx",
        "value":"\"ǂǂ646f6378\"",
        "operator": 6
        },
        {
        "key":"\"ǂǂ646F63\"",
        "count": 50,
        "name":"doc",
        "value":"\"ǂǂ646F63\"",
        "operator": 6
        },
        {
        "key":"\"ǂǂ646F636D\"",
        "count": 25,
        "name":"docm",
        "value":"\"ǂǂ646F636D\"",
        "operator": 6
        },
        {
        "key":"\"ǂǂ70707478\"",
        "count": 50,
        "name":"pptx",
        "value":"\"ǂǂ70707478\"",
        "operator": 6
        },
    ]
};

export const aggregatedFilterConfiguration = {
    ...baseFilterConfiguration,
    aggregations: [
        {
          "aggregationName":{
              "default":"Word document",
              "fr-fr":"Document Word",
              "ro-ro":"document Word"
          },
          "matchingValues":[
              "docx",
              "doc",
              "docm"
          ],
          "aggregationValue":"or(\"docx\",\"doc\",\"docm\")",
          "aggregationValueIconUrl":"https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/item-types/48/docx.svg"
        }
    ]
};
//#endregion