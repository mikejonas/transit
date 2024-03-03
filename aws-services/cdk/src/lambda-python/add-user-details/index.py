from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.utilities.data_classes import APIGatewayProxyEventV2, APIGatewayProxyResultV2
import os
import json
import httpx
from supabase import create_client, Client

logger = Logger()
tracer = Tracer()

def get_city_coordinates(place_id: str) -> dict:
    # Assuming you have a similar helper function in Python as you do in TypeScript
    pass

def handler(event: dict, context) -> dict:
    if event['requestContext']['http']['method'] != 'POST':
        return {
            "statusCode": 405,
            "body": json.dumps({"message": "Method not allowed"})
        }

    try:
        supabase_url = os.environ['SUPABASE_URL']
        supabase_key = os.environ['SUPABASE_ANON_KEY']
        supabase: Client = create_client(supabase_url, supabase_key)
        
        auth_header = event['headers'].get('Authorization')
        if auth_header:
            supabase.auth.session = auth_header  # This might need adjustment based on how you authenticate
        
        body = json.loads(event['body'])
        name = body['name']
        birth_date_and_time = body['birth_date']
        birth_location = body['birth_location']
        birth_location_place_id = body['birth_location_place_id']

        user = supabase.auth.user()  # Adjust based on how you get the user
        if not user:
            raise Exception("User not found")

        birth_coordinates = get_city_coordinates(birth_location_place_id)

        user_details = {
            "user_id": user.id,
            "name": name,
            "birth_date": birth_date_and_time[:10],
            "birth_time": birth_date_and_time[11:19],
            "birth_location": birth_location,
            "birth_latitude": birth_coordinates['lat'],
            "birth_longitude": birth_coordinates['lng'],
        }

        # Here you would insert `user_details` to your database
        # Since the database interaction is abstracted in your TypeScript example,
        # you would need to implement something similar in Python

        return {
            "statusCode": 200,
            "body": json.dumps(user_details)
        }
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": str(e)})
        }
