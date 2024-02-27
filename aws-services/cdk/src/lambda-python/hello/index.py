import requests
from bs4 import BeautifulSoup
import arrow

def handler(event, context):
    # response = requests.get('https://httpbin.org/html')
    # soup = BeautifulSoup(response.content, 'html.parser')
    # num_paragraphs = len(soup.find_all('p'))
    num_paragraphs = 3
    # ip_response = requests.get('https://httpbin.org/ip')
    # ip_address = ip_response.json()['origin']
    ip_address = "f23324"
    current_time = arrow.now().format('YYYY-MM-DD HH:mm:ss')  # Format the current time

    return {
        'statusCode': 200,
        'body': f'Hello from Python Lambda! Your IP is {ip_address}. The page contains {num_paragraphs} paragraph tags. Current time: {current_time}.'
    }
