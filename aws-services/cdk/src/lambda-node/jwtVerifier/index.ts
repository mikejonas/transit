import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda'
import * as jwt from 'jsonwebtoken'

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!
const AWS_SAM_LOCAL = process.env.AWS_SAM_LOCAL // set to "true" when running locally

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  try {
    const token = event.authorizationToken.split(' ')[1] // Assuming "Bearer <token>"
    if (!token) {
      throw new Error('Unauthorized') // Triggering the catch block to return a Deny policy
    }
    jwt.verify(token, SUPABASE_JWT_SECRET, { algorithms: ['HS256'] })
    return generatePolicy('user', 'Allow', event.methodArn)
  } catch (error) {
    console.error(error)
    return generatePolicy('user', 'Deny', event.methodArn)
  }
}

function generatePolicy(
  principalId: string,
  effect: string,
  resource: string,
): APIGatewayAuthorizerResult {
  const policy: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: AWS_SAM_LOCAL === 'true' ? '*' : resource,
        },
      ],
    },
  }
  return policy
}
