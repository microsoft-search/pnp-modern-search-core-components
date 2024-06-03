import { IFilePickerResult } from "@pnp/spfx-controls-react";
import IFileService from "./IFileService";
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { FilesSearchService } from "@pnp/spfx-controls-react/lib/services/FilesSearchService";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import { PageContext } from "@microsoft/sp-page-context";
import { HttpClient, SPHttpClient } from "@microsoft/sp-http";

const FileService_ServiceKey = 'ModernSearchCoreFileService';

export class FileService implements IFileService {

    public _fileSearchService: FilesSearchService;
    public static ServiceKey: ServiceKey<IFileService> = ServiceKey.create(FileService_ServiceKey, FileService);

    constructor(serviceScope: ServiceScope) {
        
        serviceScope.whenFinished(() => {

            const pageContext = serviceScope.consume<PageContext>(PageContext.serviceKey);
            const spHttpClient = serviceScope.consume<SPHttpClient>(SPHttpClient.serviceKey);
            const httpClient = serviceScope.consume<HttpClient>(HttpClient.serviceKey);

            const context: Partial<BaseComponentContext> = {
                pageContext: pageContext,
                spHttpClient: spHttpClient,
                httpClient: httpClient
            };

            this._fileSearchService = new FilesSearchService(context as BaseComponentContext, null);

        })
    }

    public async downloadFileContent(filePickerResult: IFilePickerResult): Promise<string> {
        
        let file = null;
        let fileContent = null;
        if (filePickerResult.spItemUrl) {
            file = await this._fileSearchService.downloadSPFileContent(filePickerResult.fileAbsoluteUrl, filePickerResult.fileName);
        } else {
            file = await this._fileSearchService.downloadBingContent(filePickerResult.fileAbsoluteUrl, filePickerResult.fileName);
        }

        if (file) {
            fileContent = await file.text();
        }

        return fileContent;
    }
}