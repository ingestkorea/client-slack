export interface MetadataBearer {
  $metadata: ResponseMetadata;
}

export interface ResponseMetadata {
  httpStatusCode?: number;
  attempts?: number;
  totalRetryDelay?: number;
  requestId?: string;
  oauthScopes?: string;
}
