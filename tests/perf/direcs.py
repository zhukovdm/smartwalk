from datetime import datetime
import matplotlib.pyplot as plt
import random
import requests

from store import Store
from shared import baseUrl, serialize_request

count = [0, 1, 3, 5]
measurements = [([], []) for _ in range(len(count))]

cities = [
    ((14.18, 50.20, 14.80, 49.90), "Prague"),
    ((16.52, 49.27, 16.72, 49.12), "Brno"),
    ((18.14, 49.88, 18.36, 49.75), "Ostrava"),
    ((13.29, 49.79, 13.44, 49.69), "Plzen"),
    ((14.99, 50.81, 15.11, 50.68), "Liberec")
]

def get_url(request: dict) -> str:
    return f"{baseUrl}/search/direcs?query={serialize_request(request)}"

def make_trial(request: dict) -> (float, float):
    start_time = datetime.now()

    response = requests.get(get_url(request), headers={
        "Accept": "application/json; charset=utf-8"
    })
    stop_time = datetime.now()

    distance = response.json()[0]["distance"]
    time_dif = (stop_time - start_time).total_seconds() * 1000.0

    return (distance / 1000.0, time_dif)

def measure() -> None:
    global count, measurements

    with Store() as store:
        for (bbox, _) in cities:
            places = store.get_places_within(bbox)
            length = len(places)

            for i in range(len(count)):
                for _ in range(100):
                    seq = []
                    (xpoints, ypoints) = measurements[i]

                    for _ in range(count[i] + 2):
                        seq.append(places[random.randint(0, length - 1)]["location"])

                    (x, y) = make_trial({ "waypoints": seq })

                    xpoints.append(x)
                    ypoints.append(y)

def draw() -> None:
    global count, measurements

    fig, axs = plt.subplots(2, 2)

    for i in range(len(count)):
        row = i // 2
        col = i % 2

        ax = axs[row, col]

        (xpoints, ypoints) = measurements[i]
        ax.set_title(f"{count[i] + 2} points")
        ax.scatter(xpoints, ypoints, facecolors="none", edgecolors="#0380fc", linewidth=0.55)

        if (row == 1):
            ax.set_xlabel("Distance, km")

        if (col == 0):
            ax.set_ylabel("Response time, ms")

    fig.tight_layout()

    plt.savefig(f"./direcs.pdf", format="pdf")

def main() -> None:
    measure()
    draw()

main()
