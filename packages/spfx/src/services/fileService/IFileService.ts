import { IFilePickerResult } from "@pnp/spfx-controls-react";
import { FilesSearchService } from "@pnp/spfx-controls-react/lib/services/FilesSearchService";

export default interface IFileService {
    _fileSearchService: FilesSearchService;
    downloadFileContent(filePickerResult: IFilePickerResult): Promise<string>;
}