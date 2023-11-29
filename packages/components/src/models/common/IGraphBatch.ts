export const BATCH_SIZE_LIMIT = 20; // https://docs.microsoft.com/en-us/graph/known-issues#json-batching

export interface IGraphBatchRequest {
    id: string;
    dependsOn?: string[];
    method: HttpMethod;
    url: string;
    body?: object;
    headers?: {[key: string]: string};
}
  
export interface IGraphBatchBody {
    requests: IGraphBatchRequest[];
}

export enum HttpMethod {
    Get = "GET",
    Post = "POST"
}