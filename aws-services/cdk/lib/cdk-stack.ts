import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"; // Import NodejsFunction
import * as apigatewayv2Integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import path = require("path");
require("dotenv").config({ path: "../.env" });

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Node.js Lambda Function for HelloWorld
    const helloWorldLambda = new NodejsFunction(
      this,
      "HelloWorldLambdaFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "handler",
        entry: path.join(__dirname, "../src/lambda-node/hello/index.ts"),
      }
    );

    const locationAutocompleteLambda = new NodejsFunction(
      this,
      "LocationAutocompleteLambdaFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "handler",
        entry: "./src/lambda-node/location-autocomplete/index.ts",
        environment: {
          OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
          GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY!,
        },
      }
    );

    // Python Lambda Function
    const pythonLambda = new lambda.Function(this, "PythonLambdaFunction", {
      runtime: lambda.Runtime.PYTHON_3_12, // Adjusted to a supported runtime as of my last update
      handler: "hello.handler",
      code: lambda.Code.fromAsset("./src/lambda-python"),
    });

    // HTTP API Gateway
    const httpApi = new apigatewayv2.HttpApi(this, "HttpApiGateway", {
      apiName: "LambdaEndpointHttpApi",
      description: "HTTP API endpoint for Lambda Functions.",
    });

    // Add routes for helloWorldLambda
    httpApi.addRoutes({
      path: "/hello-node",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "HelloWorldLambdaIntegration",
        helloWorldLambda
      ),
    });

    // Add routes for locationAutocompleteLambda
    httpApi.addRoutes({
      path: "/location-autocomplete",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "LocationAutocompleteLambdaIntegration",
        locationAutocompleteLambda
      ),
    });

    // Add routes for pythonLambda
    httpApi.addRoutes({
      path: "/hello-python",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "PythonLambdaIntegration",
        pythonLambda
      ),
    });
  }
}
