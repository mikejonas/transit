import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Node.js Lambda Function
    const nodeLambda = new lambda.Function(this, "NodeLambdaFunction", {
      runtime: lambda.Runtime.NODEJS_20_X, // Choose the runtime environment
      handler: "hello.handler", // Points to the file and handler function
      code: lambda.Code.fromAsset("../lambda-node/dist"), // compiled ts code
    });

    // Python Lambda Function
    const pythonLambda = new lambda.Function(this, "PythonLambdaFunction", {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("../lambda-python"),
    });

    // API Gateway REST API
    const api = new apigateway.RestApi(this, "ApiGateway", {
      restApiName: "LambdaEndpointApi",
      description: "Endpoint for Lambda Functions.",
    });

    // Node.js Lambda integration
    const nodeIntegration = new apigateway.LambdaIntegration(nodeLambda);
    const nodeResource = api.root.addResource("hello-node"); // Example path: /node
    nodeResource.addMethod("GET", nodeIntegration);

    // Python Lambda integration
    const pythonIntegration = new apigateway.LambdaIntegration(pythonLambda);
    const pythonResource = api.root.addResource("hello-python"); // Example path: /python
    pythonResource.addMethod("GET", pythonIntegration);
  }
}
