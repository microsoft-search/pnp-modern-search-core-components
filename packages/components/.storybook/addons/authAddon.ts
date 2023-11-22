import { LoginType, Providers, ProviderState, TemplateHelper } from "@microsoft/mgt-element";
import { makeDecorator, MakeDecoratorResult } from "@storybook/addons";
import { TestsHelper } from "../../src/helpers/TestsHelper";

export const withAuth: MakeDecoratorResult = makeDecorator({
  name: `withAuth`,
  parameterName: "myParameter",
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context, { parameters }) => {

    const currentProvider = Providers.globalProvider;
    if (!currentProvider || 
        (currentProvider && currentProvider.state !== ProviderState.SignedIn)) {

          const fakeProvider = TestsHelper.getTestProvider();
      
          Providers.globalProvider = fakeProvider;
    }

    return getStory(context);
  }
});