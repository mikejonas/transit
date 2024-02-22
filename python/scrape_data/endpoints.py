import os
import requests
from dotenv import load_dotenv

load_dotenv()
COSTAR_JWT = os.environ.get("COSTAR_JWT")
CHANI_ACCESS_TOKEN = os.environ.get("CHANI_ACCESS_TOKEN")


def fetch_costar_daily_horoscope_v1(month, day, year):
    url = f"https://api.costarastrology.com/user/current/timeline/v1/daily/{year}-{month:02d}-{day:02d}T00:00:00Z/"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Co%20%E2%80%94%20Star/7780 CFNetwork/1490.0.4 Darwin/23.2.0",
        "Accept-Language": "en-US,en;q=0.9",
        "Authorization": f"Bearer {COSTAR_JWT}"
    }

    response = requests.get(url, headers=headers)
    return response.json()

def fetch_costar_daily_horoscope_v2(month, day, year):
    url = f"https://api.costarastrology.com/user/current/timeline/v2/daily/{year}-{month:02d}-{day:02d}?maxFriends=3&birthdays=true"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Co%20%E2%80%94%20Star/7780 CFNetwork/1490.0.4 Darwin/23.2.0",
        "Accept-Language": "en-US,en;q=0.9",
        "Authorization": f"Bearer {COSTAR_JWT}"
    }

    response = requests.get(url, headers=headers)
    return response.json()

def fetch_chani_contentful_data(planetPageHouse="4", planet="Venus", content_type="planetInSignAspects"):
    url = "https://cdn.contentful.com/spaces/hlytyi6rsuow/environments/master/entries"
    params = {
        "fields.planetPageHouse": planetPageHouse,
        "fields.planet": planet,
        "content_type": content_type
    }
    headers = {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "X-Contentful-User-Agent": "app com.chaninicholas.chaniapp/1.3.5; sdk contentful.swift/1.3.5; platform Swift/4.0; os iOS/17.2.1;",
        "User-Agent": "ChaniNicholas/1 CFNetwork/1490.0.4 Darwin/23.2.0",
        "Authorization": f"Bearer {CHANI_ACCESS_TOKEN}"
    }

    response = requests.get(url, headers=headers, params=params)
    return response.json()