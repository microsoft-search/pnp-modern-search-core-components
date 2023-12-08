import * as React from 'react';
import { ISearchVerticalsProps } from './ISearchVerticalsProps';
import { wrapWc } from 'wc-react';
import { SearchVerticalsComponent } from '@pnp/modern-search-core';
import { EventConstants } from "@pnp/modern-search-core/dist/es6/common/Constants";
import { ISearchVerticalEventData } from "@pnp/modern-search-core/dist/es6/models/events/ISearchVerticalEventData";

const SearchVerticalsWebComponent = wrapWc<SearchVerticalsComponent>('pnp-search-verticals');

export default class SearchVerticals extends React.Component<ISearchVerticalsProps, {}> {
  
  private componentRef = React.createRef<SearchVerticalsComponent>();

  constructor(props: ISearchVerticalsProps) {
    super(props);

    this.onVerticalKeySelected = this.onVerticalKeySelected.bind(this);
  }

  public render(): React.ReactElement<ISearchVerticalsProps> {

    return  <SearchVerticalsWebComponent
              ref={this.componentRef}
              key={this.props.id}
              id={this.props.id}
              verticals={this.props.verticalConfiguration}
              theme={this.props.theme}
            />;
  }

  public componentDidMount(): void {
    this.componentRef.current.addEventListener(EventConstants.SEARCH_VERTICAL_EVENT, this.onVerticalKeySelected);
  }

  public componentWillUnmount(): void {
    this.componentRef.current.removeEventListener(EventConstants.SEARCH_VERTICAL_EVENT, this.onVerticalKeySelected)
  }

  private onVerticalKeySelected(ev: CustomEvent<ISearchVerticalEventData>): void {

    if (this.props.onVerticalSelected) {
      this.props.onVerticalSelected(ev.detail.selectedVertical.key);
    }
  }
}
