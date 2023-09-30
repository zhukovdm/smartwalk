from datetime import timedelta
import json
from urllib.parse import quote

baseUrl = "http://localhost:5017/api"
headers = {
    "Accept": "application/json; charset=utf-8"
}

def time_to_milliseconds(time_dif: timedelta) -> float:
    return time_dif.total_seconds() * 1000.0

def serialize_request(request: dict):
    return quote(json.dumps(request, separators=(',', ':')))

bboxes = [
    ((14.18, 50.20, 14.80, 49.90), "Prague"),
    ((16.52, 49.27, 16.72, 49.12), "Brno"),
    ((18.14, 49.88, 18.36, 49.75), "Ostrava"),
    ((13.29, 49.79, 13.44, 49.69), "Plzen"),
    ((14.99, 50.81, 15.11, 50.68), "Liberec")
]
