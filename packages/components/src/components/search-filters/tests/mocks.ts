import { BuiltinFilterTemplates } from "../../../models/common/BuiltinTemplate";
import { IDataFilterResult, FilterConditionOperator } from "../../../models/common/IDataFilter";
import { IDataFilterConfiguration, FilterSortType, FilterSortDirection } from "../../../models/common/IDataFilterConfiguration";

export const basefilterResults: IDataFilterResult[] = [
   {
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
   },
   {
      "filterName":"ModifiedBy",
      "values":[
         {
            "key":"\"ǂǂ557365722031\"",
            "count":6043,
            "name":"User 1",
            "value":"\"ǂǂ557365722031\"",
            "operator":6
         },
         {
            "key":"\"ǂǂ557365722031\"",
            "count":5607,
            "name":"User 2",
            "value":"\"ǂǂ557365722031\"",
            "operator":6
         },
         {
            "key":"\"ǂǂ557365722033\"",
            "count":3828,
            "name":"User 3",
            "value":"\"ǂǂ557365722033\"",
            "operator":6
         }
      ]
   }
 ];
 
export const baseFilterConfiguration: IDataFilterConfiguration[] =  [
   {
      filterName: "FileType",
      template: BuiltinFilterTemplates.CheckBox,
      displayName: "FileType",
      showCount: true,
      operator: FilterConditionOperator.OR,
      isMulti: false,
      sortBy: FilterSortType.ByName,
      sortDirection: FilterSortDirection.Descending,
      maxBuckets: 50,
      sortIdx: 1,
      verticalKeys: ["tab1"]
   },
   {
      filterName: "ModifiedBy",
      template: BuiltinFilterTemplates.CheckBox,
      displayName: "LastModifiedTime",
      showCount: true,
      operator: FilterConditionOperator.OR,
      isMulti: false,
      sortBy: FilterSortType.ByCount,
      sortDirection: FilterSortDirection.Descending,
      maxBuckets: 50,
      sortIdx: 2,
      verticalKeys: ["tab2"]
   }
];