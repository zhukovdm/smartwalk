import json

import requests

url = "http://localhost:3000/api/advice/keywords?prefix=a&count=0"


def main() -> None:
    response = requests.get(
        url,
        headers={
            "Accept": "application/json; charset=utf-8",
        },
    )
    print(response.status_code)
    print(json.dumps(response.json(), indent=2))


if __name__ == "__main__":
    main()
