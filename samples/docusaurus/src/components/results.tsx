import { useEffect, useState } from "react";
import { wrapWc } from "wc-react";
import { MgtLogin, SearchFiltersComponent, SearchInputComponent, SearchResultsComponent, SearchVerticalsComponent } from "@pnp/modern-search-core";
import { BuiltinFilterTemplates } from "@pnp/modern-search-core/dist/es6/models/common/BuiltinTemplate";
import { FilterConditionOperator } from "@pnp/modern-search-core/dist/es6/models/common/IDataFilter";
import { FilterSortDirection, FilterSortType } from "@pnp/modern-search-core/dist/es6/models/common/IDataFilterConfiguration";
import { EntityType } from "@pnp/modern-search-core/dist/es6/models/search/IMicrosoftSearchRequest";

const SearchInputWebComponent = wrapWc<Partial<SearchInputComponent>>('pnp-search-input');
const SearchFiltersWebComponent = wrapWc<Partial<SearchFiltersComponent>>('pnp-search-filters');
const SearchVerticalsWebComponent = wrapWc<Partial<SearchVerticalsComponent>>('pnp-search-verticals');
const SearchResultsWebComponent = wrapWc<Partial<SearchResultsComponent>>('pnp-search-results');
const MgtLoginWebComponent = wrapWc<Partial<MgtLogin>>('mgt-login');

export default function Results(): JSX.Element { 

    const [shouldRender, setShouldRender] = useState<boolean>(false);

    // useEffect(() => {

    //     const handle = async () => {

    //         const { Providers, ProviderState } = await import('@pnp/modern-search-core');
    //         console.log(Providers.globalProvider)
    //         if (Providers.globalProvider.state === ProviderState.SignedIn) {
    //             setShouldRender(true)
    //         }
    //         Providers.globalProvider.onStateChanged = (state) => {
    //             if (Providers.globalProvider.state === ProviderState.SignedIn) {
                    
    //                 alert("YOLo")
    //                 setShouldRender(true)
    //             }
    //         }
        
    //     };

    //         handle();
        
    // }, []);

    return <>    
            <MgtLoginWebComponent></MgtLoginWebComponent>
            <>
                <SearchInputWebComponent 
                    id='edfdea93-23c9-4ba6-94d9-a848a1384104'
                    inputPlaceholder='Enter a keyword...'
                    defaultQueryStringParameter={"q"}
                ></SearchInputWebComponent>

                <SearchFiltersWebComponent
                    id="4f5ad5cd-8626-40ab-9c89-466a64f57a8e"
                    filterConfiguration={[
                        {
                            displayName: "Projects",
                            filterName:"PwCProjectName",
                            template: BuiltinFilterTemplates.CheckBox,
                            isMulti:false, maxBuckets:50, 
                            operator: FilterConditionOperator.OR,
                            showCount: false,
                            sortBy: FilterSortType.ByCount,
                            sortDirection: FilterSortDirection.Ascending,
                            sortIdx:1
                        },
                        {
                            displayName: "Technologies",
                            filterName:"PwCProjectTechnologies",
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

                <SearchVerticalsWebComponent 
                    id="0fa619a7-442a-4255-8fca-f3ce36a01518"
                    verticals={[
                        {
                            key: "projects",
                            tabName: "Projects",
                            isLink: false,
                            linkUrl: null,
                            openBehavior: null,
                            tabValue: null
                        },                   
                        {
                            key: "pages",
                            tabName: "Pages",
                            isLink: false,
                            linkUrl: null,
                            openBehavior: null,
                            tabValue: null
                        }
                    ]}
                >
                </SearchVerticalsWebComponent>

                <SearchResultsWebComponent
                    id="97c0a5dd-653b-4b41-8ced-7ed0feb7da88"
                    defaultQueryText="*"
                    queryTemplate="{searchTerms}"
                    selectedFields={["title","weburl","Docusaurustag","filetype","source","ogkeywords","url","iconUrl","createddatetime","PwCProjectName","PwCProjectRepositoryUrl","PwCProjectDescription","PwCProjectContacts","PwCProjectType","PwCProjectTechnologies"]}
                    searchInputComponentId="edfdea93-23c9-4ba6-94d9-a848a1384104"
                    searchFiltersComponentId="4f5ad5cd-8626-40ab-9c89-466a64f57a8e"
                    searchVerticalsComponentId="0fa619a7-442a-4255-8fca-f3ce36a01518"
                    connectionIds={[`/external/connections/${process.env.ENV_MSSearchConnectionId}`]}
                    entityTypes={[EntityType.ExternalItem]}
                    selectedVerticalKeys={["projects"]}
                    pageSize={10}
                >
                    <template data-type="items">
                        <div className="@container">
                            <div className="text-textColor font-primary grid grid-cols-3 auto-cols-auto gap-4">
                                <div data-for='item in items' className="rounded-sm bg-white shadow-lg p-4 space-y-2 flex flex-col">
                                    <div className="flex justify-center items-start">
                                        <div className="relative mb-3 flex w-full">
                                            <div className="flex align-top space-x-1" >
                                                <div className="m-1"><svg id="f4337506-5d95-4e80-b7ca-68498c6e008e" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><defs><linearGradient id="ba420277-700e-42cc-9de9-5388a5c16e54" x1="9" y1="16.97" x2="9" y2="1.03" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0078d4" /><stop offset="0.16" stop-color="#1380da" /><stop offset="0.53" stop-color="#3c91e5" /><stop offset="0.82" stop-color="#559cec" /><stop offset="1" stop-color="#5ea0ef" /></linearGradient></defs><title>PwC SA DevOps organization</title><path id="a91f0ca4-8fb7-4019-9c09-0a52e2c05754" d="M17,4v9.74l-4,3.28-6.2-2.26V17L3.29,12.41l10.23.8V4.44Zm-3.41.49L7.85,1V3.29L2.58,4.84,1,6.87v4.61l2.26,1V6.57Z" fill="url(#ba420277-700e-42cc-9de9-5388a5c16e54)" /></svg></div>
                                                <div className="font-bold line-clamp-2 h-full">
                                                    <a href='[[item.pwcprojectrepositoryurl]]' target="_blank">[[item.pwcprojectname]]</a>
                                                </div>  
                                            </div>                           
                                        </div>
                                    </div>
                                    <div className="p-2 relative mb-3 w-full">
                                        <div data-if='[[item.pwcprojecttechnologies]]' className="capitalize p-[2px] grid grid-cols-2 auto-cols-auto gap-1">
                                            <div data-for="itm in item.pwcprojecttechnologies.split(',')">
                                                <div className="text-xs text-left">#[[ itm ]]</div>
                                            </div>
                                        </div>
                                    </div>                    
                                    <div data-if='[[item.pwcprojectdescription]]' className="p-2 h-full">
                                        <p data-html className="line-clamp-4">[[ item.pwcprojectdescription ]]</p>
                                    </div>
                                    <div data-if='' className="break-words"></div>
                                </div>                
                            </div>
                        </div>
                    </template>

                </SearchResultsWebComponent>

                <SearchResultsWebComponent
                    id="68f37193-8a2e-4c09-8337-1c3db978ccb8"
                    defaultQueryText="*"
                    queryTemplate="{searchTerms}"
                    selectedFields={["title","weburl","filetype","source","keywords","url","iconUrl","createddatetime","PwCProjectName"]}
                    searchInputComponentId="edfdea93-23c9-4ba6-94d9-a848a1384104"
                    searchFiltersComponentId="4f5ad5cd-8626-40ab-9c89-466a64f57a8e"
                    searchVerticalsComponentId="0fa619a7-442a-4255-8fca-f3ce36a01518"
                    connectionIds={[`/external/connections/${process.env.ENV_MSSearchConnectionId}`]}
                    entityTypes={[EntityType.ExternalItem]}
                    selectedVerticalKeys={["pages"]}
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
            </>
        </>
        ;
}
