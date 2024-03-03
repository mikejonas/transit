# AWS Cloud Development Kit (CDK) and SAM Workflow Setup Guide

CDK is an AWS framework to define cloud application resources. So in code, we can set up our lambda functions, api gateways, and more, and then deploy it with a terminal command.

SAM is a tool for building and running aws serverless applications (like lambda's and api gateway). Here, we're using it to run our defined CDK resources locally, in a dropbox container.

## Prerequisites

- Node.js and npm
- Python and pip
- AWS CLI configured with your credentials
- Dropbox

## Setting Up AWS SAM

We use AWS sam for local development

1. Install AWS SAM CLI using `pipx` or `pip`. If you don't have `pipx`, you can install it via pip with `pip install pipx`.

   ```bash
   pipx install aws-sam-cli
   # OR
   pip install aws-sam-cli
   ```

2. Verify the installation:

   ```bash
   sam --version
   ```

3. To start the API locally:

```bash
# see package.json for latest commands.
# recommended: start from root directory
```

4. Set up the AWS Toolkit in VSCode to integrate your AWS resources and SAM applications directly within your IDE.

## Installing AWS CDK

AWS CDK allows you to define your cloud resources using familiar programming languages. CDK generates the output for us running the api with sam locally and to deploy the api to aws

1. Install AWS CDK globally using npm:

   ```bash
   npm install -g aws-cdk
   ```

## CDK and SAM Workflow

This workflow helps in running APIs locally and managing AWS Lambda functions and API Gateway through CDK.

- **Managing Lambda Functions**:

  - Create or modify Lambda functions in `/lambda-python` or `/lambda-node`.
  - Restart the API when a new Lambda function is created. Modifying existing functions should not require a restart.

- **Add or modify routes or lambdas**:
  - Modify `cdk/lib/cdk-stack.ts`
  - After making changes, restart the API to apply these updates.

### Additional Tips

- Always ensure your AWS CLI is configured with the correct access rights and region.
- Use the AWS Toolkit in VSCode to simplify the deployment and debugging of your applications.
- Familiarize yourself with the CDK documentation for advanced patterns and infrastructure as code best practices.

By following this workflow, you can efficiently develop, test, and deploy serverless applications using AWS CDK and SAM.
