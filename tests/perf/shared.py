import json
from urllib.parse import quote

baseUrl = "http://localhost:5017/api"

def serialize_request(request: dict):
    return quote(json.dumps(request, separators=(',', ':')))
