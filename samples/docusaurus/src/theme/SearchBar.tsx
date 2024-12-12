import { wrapWc } from 'wc-react';
import { MgtLogin, SearchInputComponent } from '@pnp/modern-search-core';
import { PageOpenBehavior, QueryPathBehavior } from '@pnp/modern-search-core/dist/es6/helpers/UrlHelper';
import React from "react";

const SearchInputWebComponent = wrapWc<Partial<SearchInputComponent>>('pnp-search-input');
const MgtLoginWebComponent = wrapWc<Partial<MgtLogin>>('mgt-login');

export default function SearchBar() {

    return  <div className='flex items-center space-x-3'>

                <SearchInputWebComponent 
                    id='f566fb98-4010-485b-a44b-b53c16852cd6'
                    inputPlaceholder='Enter a keyword...'
                    searchInNewPage={true}
                    pageUrl={`${new URL(`${process.env.ENV_SiteUrl}/search`)}`}
                    queryPathBehavior={QueryPathBehavior.QueryParameter}
                    queryStringParameter='k'
                    defaultQueryStringParameter='k'
                    openBehavior={PageOpenBehavior.Self}
                />

                <MgtLoginWebComponent loginView='avatar'></MgtLoginWebComponent>                
            </div>;
}