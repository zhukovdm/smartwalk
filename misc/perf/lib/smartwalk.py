import json
import requests
from urllib.parse import quote

from lib.settings import SMARTWALK_API_ORIGIN

baseUrl = f"{SMARTWALK_API_ORIGIN}/api"
headers = {
    "Accept": "application/json; charset=utf-8"
}

def make_request(url: str):
    return requests.get(url, headers=headers)

def serialize_request(request: dict):
    return quote(json.dumps(request, separators=(',', ':')))

bboxes = [
    ((14.18, 50.20, 14.80, 49.90), "Prague"),
    ((16.52, 49.27, 16.72, 49.12), "Brno"),
    ((18.14, 49.88, 18.36, 49.75), "Ostrava"),
    ((13.29, 49.79, 13.44, 49.69), "Plzen"),
    ((14.99, 50.81, 15.11, 50.68), "Liberec"),
    ((16.96, 49.78, 17.54, 49.40), "Olomouc"),
    ((14.18, 49.17, 14.76, 48.78), "Ceske Budejovice"),
    ((15.54, 50.40, 16.12, 50.02), "Hradec Kralove"),
    ((15.49, 50.22, 16.07, 49.85), "Pardubice"),
    ((13.74, 50.85, 14.32, 50.48), "Usti nad Labem"),
]
