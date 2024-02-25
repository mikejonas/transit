/**
 * Example Lambda function written in TypeScript
 * Useful for testing AWS CDK deployments while developing
 */
export async function handler(event: any): Promise<any> {
  try {
    const response = await fetch("https://api.github.com");
    const data = await response.json();

    // Check if data is valid JSON
    if (!isValidJSON(data)) {
      throw new Error("Invalid JSON data received from GitHub API");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Hello from TypeScript Lambda",
        github_status: data,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error",
      }),
    };
  }
}

function isValidJSON(data: any): boolean {
  try {
    JSON.parse(JSON.stringify(data));
    return true;
  } catch (error) {
    return false;
  }
}
