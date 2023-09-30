from datetime import datetime
import matplotlib.pyplot as plt
import random
import requests

from lib.store import Store
from lib.smartwalk import baseUrl, headers, time_to_milliseconds

measurements = []

def get_url(smartId: str) -> str:
    return f"{baseUrl}/entity/places/{smartId}"

def make_trial(smartId: str) -> float:
    start_time = datetime.now()

    _ = requests.get(get_url(smartId), headers=headers)

    stop_time = datetime.now()

    return time_to_milliseconds(stop_time - start_time)

def measure() -> None:
    global measurements

    with Store() as store:
        places = store.get_place_identifiers()
        length = len(places)

        for _ in range(50):
            measurements.append(make_trial(places[random.randint(0, length - 1)]))

def draw() -> None:
    global measurements

    fig, ax = plt.subplots()

    ax.boxplot(measurements)

    ax.set_ylabel("Response time, ms")
    ax.set(xticklabels=[])
    ax.tick_params(bottom=False)

    fig.tight_layout()
    plt.savefig(f"./entity-places.pdf", format="pdf")

def main() -> None:
    measure()
    draw()

main()
