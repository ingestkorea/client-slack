import { NodeHttpHandler, HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import { SlackClientResolvedConfig } from "../SlackClient";
import { DeserializeMiddleware } from "../models";

const REQUEST_HEADER = "x-ingestkorea-retry";

export const middlewareRetry: DeserializeMiddleware = async (
  request: HttpRequest,
  config: SlackClientResolvedConfig,
  handler: NodeHttpHandler
) => {
  const maxAttempts = 3;
  let attempts = 0;
  let totalRetryDelay = 0;
  let lastError = new IngestkoreaError({
    code: 400,
    type: "Bad Request",
    message: "Invalid Request",
    description: { attempts, maxAttempts, totalRetryDelay },
  });
  while (true) {
    try {
      let { response } = await handler.handle(request);
      return {
        output: {
          $metadata: {
            [REQUEST_HEADER]: `attempt=${attempts}`,
            ...(request.headers[REQUEST_HEADER] && { [REQUEST_HEADER]: request.headers[REQUEST_HEADER] }),
          },
        },
        response,
      };
    } catch (err) {
      attempts++;
      if (attempts > maxAttempts) throw lastError;

      const delay = attempts * 1000;
      totalRetryDelay += delay;
      lastError.error.description = { attempts, maxAttempts, totalRetryDelay };

      if (err instanceof IngestkoreaError) {
        lastError.error.description = {
          ...lastError.error.description,
          detail: err.error.description,
        };
      }
      request.headers[REQUEST_HEADER] = `attempt=${attempts}; max=${maxAttempts}; totalRetryDelay=${totalRetryDelay}`;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
