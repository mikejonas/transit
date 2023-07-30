function ErrorResponse(error_message: string): Response {
  return new Response(error_message, {
    status: 400,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function SuccessfulResponse(message: string): Response {
  return new Response(message, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export { ErrorResponse, SuccessfulResponse };
