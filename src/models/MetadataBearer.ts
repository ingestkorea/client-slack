export interface MetadataBearer {
  $metadata: ResponseMetadata;
}

export interface ResponseMetadata {
  ["x-ingestkorea-retry"]?: string;
}
