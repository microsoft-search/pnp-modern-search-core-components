import * as React from 'react';
import { ISearchVerticalsProps } from './ISearchVerticalsProps';
import { wrapWc } from 'wc-react';
import { SearchVerticalsComponent } from '@pnp/modern-search-core';
import { ComponentElements, EventConstants } from "@pnp/modern-search-core/dist/es6/common/Constants";
import { ISearchVerticalEventData } from "@pnp/modern-search-core/dist/es6/models/events/ISearchVerticalEventData";
import parse, {  } from 'html-react-parser';
import { isEqual } from '@microsoft/sp-lodash-subset';
import { Guid } from '@microsoft/sp-core-library';

const SearchVerticalsWebComponent = wrapWc<Partial<SearchVerticalsComponent>>('pnp-search-verticals');

export default class SearchVerticals extends React.Component<ISearchVerticalsProps, {}> {
  
  private componentRef = React.createRef<SearchVerticalsComponent>();

  constructor(props: ISearchVerticalsProps) {
    super(props);

    this.onVerticalKeySelected = this.onVerticalKeySelected.bind(this);
  }

  public render(): React.ReactElement<ISearchVerticalsProps> {

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const TemplateContent = () => {
      return (this.props.templateContent ? parse(this.props.templateContent) : null) as JSX.Element;
    };

    return  <SearchVerticalsWebComponent
              ref={this.componentRef}
              key={this.props.id}
              id={this.props.id}
              verticals={this.props.verticalConfiguration}
              enableDebugMode={this.props.enableDebugMode ? true : null}
              useMicrosoftGraphToolkit={this.props.useMicrosoftGraphToolkit ? true : null}
              theme={this.props.theme}              
            >
              <TemplateContent/>
            </SearchVerticalsWebComponent>;
  }

  public componentDidUpdate(prevProps: Readonly<ISearchVerticalsProps>): void {
    
    if (!isEqual(prevProps.templateContent, this.props.templateContent)) {

      // Forces a tempalte re-render by faking an update to the template context
      // TODO: Find a better way to do that at component level
      // https://github.com/microsoftgraph/microsoft-graph-toolkit/blob/d27ffa723d36fa39533a4e705965ba656a71b82a/packages/mgt-element/src/components/templatedComponent.ts#L141C35-L141C46
      this.componentRef.current.templateContext = {...this.componentRef.current.templateContext, random: Guid.newGuid() }
       this.componentRef.current.shadowRoot.querySelectorAll(ComponentElements.CheckboxFilterComponent).forEach((e: SearchVerticalsComponent) => {
        e.templateContext = {...e.templateContext, random: Guid.newGuid()};
      });
    }
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
