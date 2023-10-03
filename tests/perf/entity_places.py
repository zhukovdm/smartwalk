import matplotlib.pyplot as plt
import random
import requests
import time

from lib.store import Store
from lib.smartwalk import baseUrl, headers

measurements = []

def get_url(smartId: str) -> str:
    return f"{baseUrl}/entity/places/{smartId}"

def make_trial(smartId: str) -> float:
    t0 = time.perf_counter_ns()
    res = requests.get(get_url(smartId), headers=headers)
    t1 = time.perf_counter_ns()

    if (res.status_code != 200):
        raise Exception

    return (t1 - t0) / 1_000_000

def measure() -> None:
    global measurements

    with Store() as store:
        places = store.get_place_identifiers()
        length = len(places)

        for _ in range(100):
            measurements.append(make_trial(places[random.randint(0, length - 1)]))

def draw() -> None:
    global measurements

    fig, ax = plt.subplots()

    ax.boxplot(measurements)

    ax.set_ylabel("Response time, ms")
    ax.set(xticklabels=[])
    ax.tick_params(bottom=False)

    fig.tight_layout()
    plt.savefig(f"./perf-entity-places.pdf", format="pdf")

def main() -> None:
    measure()
    draw()

main()
