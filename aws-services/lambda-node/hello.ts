import { APIGatewayProxyResult } from "aws-lambda";

export async function handler(event: any): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from TypeScript Lambda!",
    }),
  };
}
