from transits import ZodiacTransits

from datetime import datetime
from zoneinfo import ZoneInfo
import time
start_time = time.time()
zodiac_transits = ZodiacTransits()

BIRTH_DATETIME = datetime(1986, 4, 23, 0, 30, tzinfo=ZoneInfo("America/New_York"))
BIRTH_LATITUDE = 40.8428759
BIRTH_LONGITUDE = -73.2928943

birth_details = ZodiacTransits.get_astrological_birth_details(BIRTH_DATETIME, BIRTH_LATITUDE, BIRTH_LONGITUDE, "America/New_York")
for obj in birth_details['object_reports']:
    print(f"{obj['object_type']} {obj['sign']} {obj['degrees']}°{obj['minutes']}'{obj['seconds']}\"")

end_time = time.time()

print(f"Execution time: {end_time - start_time} seconds")


def handler(event, context):

    return {
        'statusCode': 200,
        'body': f'Hello from Puyython Lambda/..'
    }
