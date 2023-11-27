import * as React from 'react';
import { ISearchBoxProps } from './ISearchBoxProps';
import { wrapWc } from 'wc-react';
import { SearchInputComponent } from 'pnp-modern-search-core';

const SearchInputWebComponent = wrapWc<SearchInputComponent>('pnp-search-input');

export class SearchBox extends React.Component<ISearchBoxProps, {}> {

  public render(): React.ReactElement<ISearchBoxProps> {

    return  <SearchInputWebComponent
              {...this.props}
              theme={this.props.theme}
              key={this.props.id}
              id={this.props.id}
            />;
  }
}