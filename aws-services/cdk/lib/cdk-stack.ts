import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigatewayv2Integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as apigatewayv2Authorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";

import path = require("path");
import { execSync } from "child_process";

require("dotenv").config();

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
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
          GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY!,
        },
      }
    );

    const UpdateUserDetailsLambda = new NodejsFunction(
      this,
      "UpdateUserDetailsLambdaFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "handler",
        entry: "./src/lambda-node/update-user-details/index.ts",
        environment: {
          OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
          GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY!,
          SUPABASE_URL: process.env.SUPABASE_URL!,
          SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
        },
      }
    );

    const requirementsDir = path.join("./src/lambda-python");
    const tempLayerDir = path.join("./src/lambda-python/.tmp");
    execSync(
      `pip install --upgrade -r ${requirementsDir}/requirements.txt -t ${tempLayerDir}/python`
    );

    const myLayer = new lambda.LayerVersion(this, "MyDependenciesLayer", {
      code: lambda.Code.fromAsset(tempLayerDir),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
    });

    const pythonLambda = new lambda.Function(this, "PythonLambdaFunction", {
      code: lambda.Code.fromAsset("./src/lambda-python/hello"), // Path to the folder containing your Lambda code and requirements.txt
      handler: "index.handler", // File and method name
      runtime: lambda.Runtime.PYTHON_3_12, // Specifying the runtime
      layers: [myLayer], // Adding the layer to the Lambda function
      architecture: lambda.Architecture.ARM_64, // Specify the architecture
      timeout: cdk.Duration.seconds(5), // Optional: Increase the timeout as needed
    });

    const astroLambda = new lambda.Function(this, "AstroLambdaFunction", {
      code: lambda.Code.fromAsset("./src/lambda-python/astro"), // Path to the folder containing your Lambda code
      handler: "index.handler", // Assuming your handler in astro directory is defined in index.py and named handler
      runtime: lambda.Runtime.PYTHON_3_12, // Specifying the runtime
      layers: [myLayer], // Adding the layer to the Lambda function
      architecture: lambda.Architecture.ARM_64, // Specify the architecture
      timeout: cdk.Duration.seconds(5), // Optional: Adjust the timeout as necessary
    });

    const httpApi = new apigatewayv2.HttpApi(this, "HttpApiGateway", {
      apiName: "TransitApi",
      description: "HTTP API endpoint for Lambda Functions.",
    });

    const jwtVerifierLambda = new NodejsFunction(this, "JwtVerifierFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, "../src/lambda-node/jwtVerifier/index.ts"),
      environment: {
        SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET!,
      },
    });

    // Custom Authorizer for the API Gateway
    const jwtAuthorizer = new apigatewayv2Authorizers.HttpLambdaAuthorizer(
      "JwtAuthorizer",
      jwtVerifierLambda,
      {
        identitySource: ["$request.header.Authorization"], // Define where to extract the token from
      }
    );

    httpApi.addRoutes({
      path: "/hello-node",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "HelloWorldLambdaIntegration",
        helloWorldLambda
      ),
      authorizer: jwtAuthorizer,
    });

    httpApi.addRoutes({
      path: "/location-autocomplete",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "LocationAutocompleteLambdaIntegration",
        locationAutocompleteLambda
      ),
      authorizer: jwtAuthorizer,
    });

    httpApi.addRoutes({
      path: "/update-user-details",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "UpdateUserDetailsLambdaLambdaIntegration",
        UpdateUserDetailsLambda
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
    httpApi.addRoutes({
      path: "/astro",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "PythonLambdaIntegration",
        astroLambda
      ),
    });
  }
}
