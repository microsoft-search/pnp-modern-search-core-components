import Layout from "@theme/Layout";
import { wrapWc } from "wc-react";
import { SearchFiltersComponent, SearchInputComponent, SearchResultsComponent } from "@pnp/modern-search-core";
import { BuiltinFilterTemplates } from "@pnp/modern-search-core/dist/es6/models/common/BuiltinTemplate";
import { FilterConditionOperator } from "@pnp/modern-search-core/dist/es6/models/common/IDataFilter";
import { FilterSortDirection, FilterSortType } from "@pnp/modern-search-core/dist/es6/models/common/IDataFilterConfiguration";
import { EntityType } from "@pnp/modern-search-core/dist/es6/models/search/IMicrosoftSearchRequest";
import BrowserOnly from "@docusaurus/BrowserOnly";

const SearchInputWebComponent = wrapWc<Partial<SearchInputComponent>>('pnp-search-input');
const SearchFiltersWebComponent = wrapWc<Partial<SearchFiltersComponent>>('pnp-search-filters');
const SearchResultsWebComponent = wrapWc<Partial<SearchResultsComponent>>('pnp-search-results');

export default function Searchpage(): JSX.Element {
    
    return  <Layout>  
                <main className="container container--fluid margin-vert--lg">
                    <BrowserOnly>
                    {() => {
                        return  <>
                                    <SearchInputWebComponent 
                                        id='edfdea93-23c9-4ba6-94d9-a848a1384104'
                                        inputPlaceholder='Enter a keyword...'
                                        defaultQueryStringParameter={"k"}
                                    ></SearchInputWebComponent>
                    
                                    <SearchFiltersWebComponent
                                        id="4f5ad5cd-8626-40ab-9c89-466a64f57a8e"
                                        filterConfiguration={[
                                            {
                                                displayName: "Type",
                                                filterName:"filetype",
                                                template: BuiltinFilterTemplates.CheckBox,
                                                isMulti:false, maxBuckets:50, 
                                                operator: FilterConditionOperator.OR,
                                                showCount: false,
                                                sortBy: FilterSortType.ByCount,
                                                sortDirection: FilterSortDirection.Ascending,
                                                sortIdx:1
                                            },
                                            {
                                                displayName: "Created",
                                                filterName:"createddatetime",
                                                template: BuiltinFilterTemplates.CheckBox,
                                                isMulti:false, maxBuckets:50, 
                                                operator: FilterConditionOperator.OR,
                                                showCount: false,
                                                sortBy: FilterSortType.ByCount,
                                                sortDirection: FilterSortDirection.Ascending,
                                                sortIdx:1
                                        }]}
                                        searchResultsComponentIds={["97c0a5dd-653b-4b41-8ced-7ed0feb7da88","68f37193-8a2e-4c09-8337-1c3db978ccb8"]}
                                    ></SearchFiltersWebComponent>  
                                                    
                                    <SearchResultsWebComponent
                                        id="68f37193-8a2e-4c09-8337-1c3db978ccb8"
                                        defaultQueryText="*"
                                        queryTemplate="{searchTerms}"
                                        selectedFields={["title","weburl","filetype","source","keywords","url","iconUrl","createddatetime"]}
                                        searchInputComponentId="edfdea93-23c9-4ba6-94d9-a848a1384104"
                                        searchFiltersComponentId="4f5ad5cd-8626-40ab-9c89-466a64f57a8e"
                                        connectionIds={[`/external/connections/${process.env.ENV_MSSearchConnectionId}`]}
                                        entityTypes={[EntityType.ExternalItem]}
                                        showDebugData={true}
                                        pageSize={10}
                                    >
                    
                                        <template data-type="items">
                                            <div data-for='item in items'>
                                                    <div className="mt-4 mb-4 ml-1 mr-1 grid gap-2 grid-cols-searchResult">
                                                    <div className="h-7 w-7 text-textColor m-1">
                                                        <img src="[[ item.iconurl ]]"/>
                                                    </div>
                                                    <div className="dark:text-textColorDark">
                                                        <div className="font-semibold mt-1 mb-1 ml-0 mr-0 ">
                                                            <a href="[[item.url]]" target="_blank">[[ item.title]]</a>
                                                        </div>
                                                        <div className="mt-1 mb-1 ml-0 mr-0 line-clamp-4" data-html>
                                                            [[item.summary]]
                                                        </div>
                                                    </div>
                                                    </div>          
                                            </div>
                                        </template>
                    
                                    </SearchResultsWebComponent>
                                </>;
                        
                    }}
                    </BrowserOnly> 
                </main>
            </Layout> 


}