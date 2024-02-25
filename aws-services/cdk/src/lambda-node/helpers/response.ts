import { APIGatewayProxyResultV2 } from "aws-lambda";

function ErrorResponse(
  error_message: string,
  statusCode = 400
): APIGatewayProxyResultV2 {
  console.error(error_message); // logs error for AWS Lambda function

  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error: error_message }),
  };
}

function SuccessfulResponse(message: string): APIGatewayProxyResultV2 {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: message,
  };
}

export { ErrorResponse, SuccessfulResponse };
