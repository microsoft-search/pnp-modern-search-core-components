
import { SimpleProvider } from "@microsoft/mgt-element/dist/es6/providers/SimpleProvider";
import { ProviderState, IProvider } from "@microsoft/mgt-element/dist/es6/providers/IProvider";
import { Providers } from "@microsoft/mgt-element/dist/es6/providers/Providers";

export class TestsHelper {

    public static getTestProvider(): IProvider {

        return new SimpleProvider(

            async (scopes: string[]) => { return "";},
            async () => {
                Providers.globalProvider.setState(ProviderState.Loading);
                await new Promise(resolve => setTimeout(resolve, 1000));
                Providers.globalProvider.setState(ProviderState.SignedIn);
                return;
            },
            async () => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                Providers.globalProvider.setState(ProviderState.SignedOut);
                return;
            }
        );

    }
}