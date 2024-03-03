import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import * as apigatewayv2Authorizers from 'aws-cdk-lib/aws-apigatewayv2-authorizers'
import path = require('path')
import { execSync } from 'child_process'

require('dotenv').config()

export class CdkStack extends cdk.Stack {
  private helloWorldLambda: NodejsFunction
  private pythonLambda: lambda.Function
  private astroLambda: lambda.Function
  private jwtAuthorizer: apigatewayv2Authorizers.HttpLambdaAuthorizer
  private locationAutocompleteLambda: NodejsFunction

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.createLambdaFunctions()
    this.createJwtAuthorizer()
    this.createHttpApi()
  }

  private createLambdaFunctions() {
    this.helloWorldLambda = this.createNodeLambda('HelloWorld', '../src/lambda-node/hello/index.ts')
    this.locationAutocompleteLambda = this.createNodeLambda(
      'LocationAutocomplete',
      '../src/lambda-node/location-autocomplete/index.ts',
      {
        GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY!,
      },
    )
    const pythonDependenciesLayer = this.buildPythonPackages()
    this.pythonLambda = this.createPythonLambda(
      'PythonHello',
      './src/lambda-python/hello',
      pythonDependenciesLayer,
    )
    this.astroLambda = this.createPythonLambda(
      'Astro',
      './src/lambda-python/astro',
      pythonDependenciesLayer,
    )
  }

  private createHttpApi() {
    const httpApi = new apigatewayv2.HttpApi(this, 'HttpApiGateway', {
      apiName: 'TransitApi',
      description: 'HTTP API endpoint for Lambda Functions.',
    })

    const routes = [
      {
        path: '/hello-node',
        method: apigatewayv2.HttpMethod.GET,
        lambdaFunction: this.helloWorldLambda,
        authorizer: this.jwtAuthorizer,
      },
      {
        path: '/location-autocomplete',
        method: apigatewayv2.HttpMethod.GET,
        lambdaFunction: this.locationAutocompleteLambda,
        authorizer: this.jwtAuthorizer,
      },
      {
        path: '/hello-python',
        method: apigatewayv2.HttpMethod.GET,
        lambdaFunction: this.pythonLambda,
      },
      {
        path: '/astro',
        method: apigatewayv2.HttpMethod.GET,
        lambdaFunction: this.astroLambda,
      },
    ]

    routes.forEach(({ path, method, lambdaFunction, authorizer }) => {
      httpApi.addRoutes({
        path,
        methods: [method],
        integration: new apigatewayv2Integrations.HttpLambdaIntegration(
          `${lambdaFunction.node.id}Integration`,
          lambdaFunction,
        ),
        ...(authorizer ? { authorizer } : {}),
      })
    })
  }

  private createJwtAuthorizer() {
    const jwtVerifierLambda = this.createNodeLambda(
      'JwtVerifier',
      '../src/lambda-node/jwtVerifier/index.ts',
      {
        SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET!,
      },
    )

    this.jwtAuthorizer = new apigatewayv2Authorizers.HttpLambdaAuthorizer(
      'JwtAuthorizer',
      jwtVerifierLambda,
      {
        identitySource: ['$request.header.Authorization'],
      },
    )
  }

  private createNodeLambda(
    name: string,
    entryPath: string,
    environment?: { [key: string]: string },
    options?: { timeoutSeconds?: number },
  ): NodejsFunction {
    return new NodejsFunction(this, `${name}LambdaFunction`, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: path.join(__dirname, entryPath),
      environment,
      timeout: cdk.Duration.seconds(options?.timeoutSeconds ?? 5),
    })
  }

  private createPythonLambda(
    name: string,
    assetPath: string,
    layer: lambda.ILayerVersion,
    options?: { timeoutSeconds?: number },
  ): lambda.Function {
    return new lambda.Function(this, `${name}LambdaFunction`, {
      code: lambda.Code.fromAsset(assetPath),
      handler: 'index.handler',
      runtime: lambda.Runtime.PYTHON_3_12,
      layers: [layer],
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(options?.timeoutSeconds ?? 5),
    })
  }

  private buildPythonPackages(): lambda.LayerVersion {
    const requirementsDir = path.join(__dirname, '../src/lambda-python')
    const tempLayerDir = path.join(__dirname, '../src/lambda-python/.tmp')
    const dockerCommandInstall = `docker run --rm -v "${requirementsDir}:/var/task" "public.ecr.aws/sam/build-python3.12:latest" /bin/sh -c "pip install -r /var/task/requirements.txt -t /var/task/.tmp/python --upgrade"`
    execSync(dockerCommandInstall)

    return new lambda.LayerVersion(this, 'PythonDependenciesLayer', {
      code: lambda.Code.fromAsset(tempLayerDir),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
    })
  }
}
