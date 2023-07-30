# Add User Details API Endpoint

## Overview

This endpoint is used to add a new user's details to the system. The user
details include the user's ID, name, and birth date.

## Endpoint URL

```
POST https://evsqlmjsaibcaccunysk.supabase.co/functions/v1/add-user-details
```

## cURL Request

```bash
curl -L -X POST 'https://evsqlmjsaibcaccunysk.supabase.co/functions/v1/add-user-details' \
     -H 'Authorization: Bearer <TOKEN>' \
     --data '{"user_id":"<USER_ID>", "name":"<NAME>", "birth_date":"<BIRTH_DATE>"}'
```

Replace `<TOKEN>`, `<USER_ID>`, `<NAME>`, and `<BIRTH_DATE>` with appropriate
values.

### Headers

- `Authorization`: Required. The `Bearer` token for authorizing the request.
  This must be a valid JWT token.

### Request Body Parameters

- `user_id` (string, required): A unique identifier for the user. Must be a
  valid UUID.
- `name` (string, required): The name of the user.
- `birth_date` (string, required): The birth date of the user in the format
  `YYYY-MM-DD`.

## Response

### Success Response

- **HTTP Status Code**: `200 OK`
- **Content**:

  ```json
  {
    "message": "Succesfully added user details."
  }
  ```

### Error Response

- **HTTP Status Code**: `400 Bad Request`
- **Content**:

  ```json
  {
    "message": "<ERROR_MESSAGE>"
  }
  ```

# Get User Details API Endpoint

## Overview

This endpoint is used to get a users details. The user details include the
user's ID, name, and birth date.

## Endpoint URL

```
POST https://evsqlmjsaibcaccunysk.supabase.co/functions/v1/get-user-details
```

## cURL Request

```bash
curl -L -X POST 'https://evsqlmjsaibcaccunysk.supabase.co/functions/v1/get-user-details' \
     -H 'Authorization: Bearer <TOKEN>' \
     --data '{"user_id":"<USER_ID>"}'
```

Replace `<TOKEN>`, `<USER_ID>` with appropriate values.

### Headers

- `Authorization`: Required. The `Bearer` token for authorizing the request.
  This must be a valid JWT token.

### Request Body Parameters

- `user_id` (string, required): A unique identifier for the user. Must be a
  valid UUID.

## Response

### Success Response

- **HTTP Status Code**: `200 OK`
- **Content**:

  ```json
  {
    "user_id": "<USER_ID",
    "name": "<NAME>",
    "birth_date": "<BIRTH_DATE>",
    "birth_time": "",
    "birth_location": {
      "latitude": 0,
      "longitude": 0
    }
  }
  ```

### Error Response

- **HTTP Status Code**: `400 Bad Request`
- **Content**:

  ```json
  {
    "message": "<ERROR_MESSAGE>"
  }
  ```

# Start New Conversation API Endpoint

## Overview

Given the user id start a new conversation and get the first response from GPT.

## Endpoint URL

```
POST https://evsqlmjsaibcaccunysk.supabase.co/functions/v1/start-new-conversation
```

## cURL Request

```bash
curl -L -X POST 'https://evsqlmjsaibcaccunysk.supabase.co/functions/v1/start-new-conversation' \
     -H 'Authorization: Bearer <TOKEN>' \
     --data '{"user_id":"<USER_ID>"}'
```

Replace `<TOKEN>`, `<USER_ID>` with appropriate values.

### Headers

- `Authorization`: Required. The `Bearer` token for authorizing the request.
  This must be a valid JWT token.

### Request Body Parameters

- `user_id` (string, required): A unique identifier for the user. Must be a
  valid UUID.

## Response

### Success Response

- **HTTP Status Code**: `200 OK`
- **Content**:

  ```json
  {
    "conversation_id": "<NUMBER>",
    "message_id": "<NUMBER>",
    "role": "assistant",
    "content": "<RESPONSE>"
  }
  ```

### Error Response

- **HTTP Status Code**: `400 Bad Request`
- **Content**:

  ```json
  {
    "message": "<ERROR_MESSAGE>"
  }
  ```

# Add Message Conversation API Endpoint

## Overview

Adds a message to a conversation and returns the response from GPT.

## Endpoint URL

```
POST https://evsqlmjsaibcaccunysk.supabase.co/functions/v1/add-message
```

## cURL Request

```bash
curl -L -X POST 'https://evsqlmjsaibcaccunysk.supabase.co/functions/v1/add-message' \
     -H 'Authorization: Bearer <TOKEN>' \
     --data '{"user_id":"<USER_ID>", "conversation_id":"<CONVERSATION_ID>", "new_message":"<NEW_MESSAGE>"}'
```

Replace `<TOKEN>`, `<USER_ID>`, `<CONVERSATION_ID>`, `<NEW_MESSAGE>` with
appropriate values.

### Headers

- `Authorization`: Required. The `Bearer` token for authorizing the request.
  This must be a valid JWT token.

### Request Body Parameters

- `user_id` (string, required): A unique identifier for the user. Must be a
  valid UUID.
- `conversation_id` (number, required): A unique identifier for the conversation
  you are adding a message to.
- `new_message` (string, required): The content of the new message you want to
  send.

## Response

### Success Response

- **HTTP Status Code**: `200 OK`
- **Content**:

  ```json
  {
    "conversation_id": "<CONVERSATION_ID>",
    "user_id": "<USER_ID>",
    "message_id": "<MESSAGE_ID>",
    "role": "<RESPONSE_ROLE>",
    "content": "<GPT_RESPONSE>"
  }
  ```

### Error Response

- **HTTP Status Code**: `400 Bad Request`
- **Content**:

  ```json
  {
    "message": "<ERROR_MESSAGE>"
  }
  ```
