import * as React from 'react';
import { ISearchFiltersProps } from './ISearchFiltersProps';
import { SearchFiltersComponent } from 'pnp-modern-search-core';
import { wrapWc } from 'wc-react';
import parse, {  } from 'html-react-parser';
import { isEqual } from '@microsoft/sp-lodash-subset';
import { Guid } from '@microsoft/sp-core-library';
import { ComponentElements } from 'pnp-modern-search-core/dist/es6/common/Constants';
import { CheckboxFilterComponent } from 'pnp-modern-search-core/dist/es6/components/search-filters/sub-components/filters/checkbox-filter/CheckboxFilterComponent';

const SearchFiltersWebComponent = wrapWc<SearchFiltersComponent>('pnp-search-filters');

export default class SearchFilters extends React.Component<ISearchFiltersProps, {}> {
  
  private componentRef = React.createRef<SearchFiltersComponent>();

  public render(): React.ReactElement<ISearchFiltersProps> {

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const TemplateContent = () => {
      return (this.props.templateContent ? parse(this.props.templateContent) : null) as JSX.Element;
    };

    return  <SearchFiltersWebComponent
              ref={this.componentRef}
              key={this.props.id}
              id={this.props.id}
              filterConfiguration={this.props.filtersConfiguration}
              operator={this.props.operator}
              enableDebugMode={this.props.enableDebugMode ? true : null}
              searchResultsComponentIds={this.props.searchResultsComponentIds}
              searchVerticalsComponentId={this.props.searchVerticalsComponentId}
              theme={this.props.theme}
            >
              <TemplateContent/>
            </SearchFiltersWebComponent>;
  }

  public componentDidUpdate(prevProps: Readonly<ISearchFiltersProps>): void {

      if (!isEqual(prevProps.templateContent, this.props.templateContent)) {

        // Forces a tempalte re-render by faking an update to the template context
        // TODO: Find a better way to do that at component level
        // https://github.com/microsoftgraph/microsoft-graph-toolkit/blob/d27ffa723d36fa39533a4e705965ba656a71b82a/packages/mgt-element/src/components/templatedComponent.ts#L141C35-L141C46
        this.componentRef.current.templateContext = {...this.componentRef.current.templateContext, random: Guid.newGuid() }
         this.componentRef.current.shadowRoot.querySelectorAll(ComponentElements.CheckboxFilterComponent).forEach((e: CheckboxFilterComponent) => {
          e.templateContext = {...e.templateContext, random: Guid.newGuid()};
        });
      }
  }
}
