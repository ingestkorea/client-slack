import { HttpRequest, HttpResponse, NodeHttpHandler } from "@ingestkorea/util-http-handler";
import { SlackClientResolvedConfig } from "../SlackClient";
import { MetadataBearer } from "./MetadataBearer";

export interface BuildMiddleware {
  (request: HttpRequest, config: SlackClientResolvedConfig): Promise<HttpRequest>;
}

export interface DeserializeMiddleware {
  (request: HttpRequest, config: SlackClientResolvedConfig, handler: NodeHttpHandler): Promise<{
    response: HttpResponse;
    output: MetadataBearer;
  }>;
}
