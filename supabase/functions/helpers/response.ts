function ErrorResponse(error_message: string, status = 400): Response {
  console.error(error_message); // logs error to supabase edge function logs

  return new Response(JSON.stringify({ error: error_message }), {
    status,
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
