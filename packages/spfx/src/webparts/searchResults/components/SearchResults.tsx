import * as React from 'react';
import { ISearchResultsProps } from './ISearchResultsProps';
import { SearchResultsComponent } from '@pnp/modern-search-core';
import { isEqual } from '@microsoft/sp-lodash-subset';
import { ObjectHelper } from '@pnp/modern-search-core/dist/es6/helpers/ObjectHelper';
import { ISearchResultsState } from './ISearchResultsState';
import { ISearchResultsEventData } from '@pnp/modern-search-core/dist/es6/models/events/ISearchResultsEventData';
import { wrapWc } from 'wc-react';
import parse from 'html-react-parser';
import { SlotType } from '../../../models/common/ILayoutSlot';
import { EventConstants } from '@pnp/modern-search-core/dist/es6/common/Constants';

const SearchResultsWebComponent = wrapWc<SearchResultsComponent>('pnp-search-results');

export default class SearchResults extends React.Component<ISearchResultsProps, ISearchResultsState> {

  private componentRef = React.createRef<SearchResultsComponent>();
  
  constructor(props: ISearchResultsProps) {

    super(props);

    this.handleResultsFetched = this.handleResultsFetched.bind(this);
    this.handleTemplateRendered = this.handleTemplateRendered.bind(this)
  }

  public render(): React.ReactElement<ISearchResultsProps> {

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const TemplateContent = () => {
      return (this.props.templateContent ? parse(this.props.templateContent) : null) as JSX.Element;
    };

    return  <SearchResultsWebComponent
                className={this.props.theme}
                ref={this.componentRef}
                key={this.props.id}
                id={this.props.id}
                defaultQueryText={this.props.defaultQueryText}
                queryTemplate={this.props.queryTemplate}
                entityTypes={this.props.entityTypes}
                selectedFields={this.props.selectedFields}
                connectionIds={this.props.connectionIds}
                pageSize={this.props.pageSize}
                sortFieldsConfiguration={this.props.sortFieldsConfiguration}
                numberOfPagesToDisplay={this.props.numberOfPagesToDisplay}
                searchInputComponentId={this.props.searchInputComponentId}
                searchFiltersComponentId={this.props.searchFiltersComponentId}
                searchSortComponentId={this.props.searchFiltersComponentId}
                searchVerticalsComponentId={this.props.searchVerticalsComponentId}
                selectedVerticalKeys={this.props.selectedVerticalKeys}
                showPaging={this.props.showPaging ? true : null} 
                useBetaEndpoint={this.props.useBetaEndpoint ? true : null}
                enableResultTypes={this.props.enableResultTypes ? true : null}
                enableDebugMode={this.props.enableDebugMode ? true : null}
                enableModification={this.props.enableModification ? true : null}
                enableSuggestion={this.props.enableSuggestion ? true : null}
                showCount={this.props.showCount ? true : null}
                theme={this.props.theme}
            >
              <TemplateContent/>
            </SearchResultsWebComponent>;
  }

  public componentDidMount(): void {
    this.initTemplateContext();

    this.componentRef.current.addEventListener(EventConstants.SEARCH_RESULTS_EVENT, this.handleResultsFetched);

    // https://learn.microsoft.com/en-us/graph/toolkit/customize-components/templates#template-rendered-event
    this.componentRef.current.addEventListener("templateRendered", this.handleTemplateRendered);
  }

  public async componentDidUpdate(prevProps: Readonly<ISearchResultsProps>): Promise<void> {
    
    if (!isEqual(prevProps.templateContext, this.props.templateContext) || 
        !isEqual(prevProps.templateContent, this.props.templateContent)) {
      this.initTemplateContext();
    }
  }
  
  public componentWillUnmount(): void {
    this.componentRef.current.removeEventListener(EventConstants.SEARCH_RESULTS_EVENT,this.handleResultsFetched);
  }

  private initTemplateContext(): void {
    
    this.componentRef.current.templateContext = {

      /**
       * Merges the context from web component and web part so it can be used as an unique context object
       * @param item the current item data
       * @returns the merge context
       */
      mergeContext: (item: {[key:string]: string}) => {
        return {
          ...item,
          context: this.props.templateContext
        };
      },
      context: this.props.templateContext,
      slot: (slotName: string, item?: {[key:string]: string}) => {

        const slot = this.props.templateSlots.filter(slots => slots.slotName === slotName)[0];
        if (slot) {

          switch(slot.slotType) {
            case SlotType.DynamicField: {
              const value = ObjectHelper.byPath(item, slot.slotValue);
              return value;
            }

            case SlotType.RawValue: 
              return slot.slotValue;
          }

        }
        
      }
    };    
  }

  private handleResultsFetched(data: CustomEvent<ISearchResultsEventData>): void {
    this.props.onResultsFetched(data.detail);
  }

  private handleTemplateRendered(e: Event): void {

    // Convert inner text content to HTML
    this.componentRef.current.querySelectorAll("[data-html]").forEach(el => {
      el.innerHTML = el.textContent;
    });
  }
}
