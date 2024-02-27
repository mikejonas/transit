from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import swisseph as swe

ZODIAC_INFO = [
    {"sign": "Aries", "bounds": (0, 30)},
    {"sign": "Taurus", "bounds": (30, 60)},
    {"sign": "Gemini", "bounds": (60, 90)},
    {"sign": "Cancer", "bounds": (90, 120)},
    {"sign": "Leo", "bounds": (120, 150)},
    {"sign": "Virgo", "bounds": (150, 180)},
    {"sign": "Libra", "bounds": (180, 210)},
    {"sign": "Scorpio", "bounds": (210, 240)},
    {"sign": "Sagittarius", "bounds": (240, 270)},
    {"sign": "Capricorn", "bounds": (270, 300)},
    {"sign": "Aquarius", "bounds": (300, 330)},
    {"sign": "Pisces", "bounds": (330, 360)}
]

PLANETARY_INFO = [
    {"name": "sun", "id": swe.SUN},
    {"name": "moon", "id": swe.MOON},
    {"name": "mercury", "id": swe.MERCURY},
    {"name": "venus", "id": swe.VENUS},
    {"name": "mars", "id": swe.MARS},
    {"name": "jupiter", "id": swe.JUPITER},
    {"name": "saturn", "id": swe.SATURN},
    {"name": "uranus", "id": swe.URANUS},
    {"name": "neptune", "id": swe.NEPTUNE}
]

def get_zodiac_sign(longitude: float) -> str:
    """Determines the zodiac sign based on celestial longitude."""
    for zodiac in ZODIAC_INFO:
        if zodiac["bounds"][0] <= longitude < zodiac["bounds"][1]:
            return zodiac["sign"]
    return "Unknown"  # In case the longitude does not match any bounds


class ZodiacTransits:
    @classmethod
    def find_transits(cls, start_date: datetime, end_date: datetime) -> list:
        """Calculates planetary transits within a given date range."""
        transits = []
        # Creating dictionaries for previous signs and transit start dates using planet names
        prev_signs = {planet_info['name']: None for planet_info in PLANETARY_INFO}
        prev_transit_start_date = {planet_info['name']: start_date for planet_info in PLANETARY_INFO}
        current_date = start_date

        while current_date <= end_date:
            cls._process_day(
                current_date, prev_signs, prev_transit_start_date, transits
            )
            current_date += timedelta(days=1)

        for planet, sign in prev_signs.items():
            if sign is not None:  # If the planet was in a sign at the end of the period
                transits.append(
                    {
                        "planet": planet,
                        "sign": sign,
                        "start": prev_transit_start_date[planet],
                        "end": end_date,
                    }
                )

        return transits

    @staticmethod
    def _process_day(current_date: datetime, prev_signs: dict, prev_transit_start_date: dict, transits: list) -> None:
        """Processes transits for each planet on a given day."""
        processed_hours = []
        for hour in range(24):
            jul_day_ut = swe.julday(
                current_date.year, current_date.month, current_date.day, hour
            )
            processed_hours.append((jul_day_ut, hour))

        for jul_day_ut, hour in processed_hours:
            for planet_info in PLANETARY_INFO:
                ZodiacTransits._process_planet(
                    planet_info,
                    jul_day_ut,
                    current_date,
                    hour,
                    prev_signs,
                    prev_transit_start_date,
                    transits,
                )

    @staticmethod
    def _process_planet(
        planet_info: dict,
        jul_day_ut: float,
        current_date: datetime,
        hour: int,
        prev_signs: dict,
        prev_transit_start_date: dict,
        transits: list,
    ) -> None:
        """Evaluates transit changes for a specific planet."""
        ret_val, _ = swe.calc_ut(jul_day_ut, planet_info['id'], swe.FLG_SWIEPH)        
        lon = (ret_val[0] - 30) % 360
        sign = get_zodiac_sign(lon)
        planet_name = planet_info['name']
        if prev_signs[planet_name] != sign:
            if prev_signs[planet_name] is not None:  # Ensure there was a previous sign before adding the transit
                transits.append(
                    {
                        "planet": planet_name,
                        "sign": sign,
                        "start": prev_transit_start_date[planet_name],
                        "end": current_date.replace(hour=hour, minute=0, second=0),
                    }
                )
            prev_transit_start_date[planet_name] = current_date.replace(
                hour=hour, minute=0, second=0
            )
            prev_signs[planet_name] = sign

    @staticmethod
    def get_astrological_birth_details(birth_datetime: datetime, latitude: float, longitude: float, timezone: str) -> dict:
        utc_datetime = birth_datetime.astimezone(ZoneInfo("UTC"))
        julian_day_ut = swe.julday(utc_datetime.year, utc_datetime.month, utc_datetime.day, utc_datetime.hour + utc_datetime.minute/60 + utc_datetime.second/3600)
        
        birth_details = {
            "object_reports": [],
            "date_time_and_location": {
                "date": birth_datetime.strftime("%Y-%m-%d"),
                "time": birth_datetime.strftime("%H:%M:%S"),
                "latitude": latitude,
                "longitude": longitude,
                "timezone": timezone
            }
        }

        for planet_info in PLANETARY_INFO:
            planet_id = planet_info["id"]
            ret_val, _ = swe.calc_ut(julian_day_ut, planet_id, swe.FLG_SWIEPH)
            lon = ret_val[0] % 360
            sign = get_zodiac_sign(lon)
            degree_within_sign = lon % 30
            whole_degrees = int(degree_within_sign)
            fractional_degrees = degree_within_sign - whole_degrees
            minutes = int(fractional_degrees * 60)
            seconds = int((fractional_degrees * 60 - minutes) * 60)
            is_in_retrograde = ret_val[3] < 0

            birth_details["object_reports"].append({
                "degrees": whole_degrees,
                "minutes": minutes,
                "seconds": seconds,
                "sign": sign,
                "object_type": planet_info["name"].capitalize(),
                "is_in_retrograde": is_in_retrograde
            })

        return birth_details
