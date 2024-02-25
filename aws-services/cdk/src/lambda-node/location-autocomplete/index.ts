import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ErrorResponse, SuccessfulResponse } from "../helpers/response";
import { placeAutocomplete } from "../helpers/google-places";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  if (event.requestContext.http.method !== "GET") {
    return ErrorResponse(
      `${event.requestContext.http.method} Method not allowed`,
      405
    );
  }

  try {
    const searchQuery = event.queryStringParameters?.searchQuery;
    console.log({ searchQuery });
    if (!searchQuery || searchQuery.trim().length < 3) {
      return ErrorResponse(
        "Search query must be at least 3 characters long",
        400
      );
    }

    const predictions = await placeAutocomplete(searchQuery);
    console.log({ predictions });
    return SuccessfulResponse(JSON.stringify(predictions));
  } catch (error: any) {
    console.error("Error handling request:", error);
    return ErrorResponse(error.message, 500);
  }
};
