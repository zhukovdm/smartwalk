import matplotlib
import matplotlib.pyplot as plt
import random
import requests
import time

from lib.store import Store
from lib.smartwalk import baseUrl, headers

TRIALS = 100
MEASUREMENTS = []

plt.rc("text", usetex=True)
plt.rc("font", family="serif")
matplotlib.rcParams.update({'font.size': 15})

def get_url(smartId: str) -> str:
    return f"{baseUrl}/entity/places/{smartId}"

def make_trial(smartId: str) -> float:
    """
    Time of one request in milliseconds.
    """

    t0 = time.perf_counter_ns()
    res = requests.get(get_url(smartId), headers=headers)
    t1 = time.perf_counter_ns()

    if (res.status_code != 200):
        raise Exception

    return (t1 - t0) / 1_000_000


def measure() -> None:
    """
    Select a place identifier at random and fetch its full representation.
    """
    global MEASUREMENTS, TRIALS

    with Store() as store:
        places = store.get_place_identifiers()
        length = len(places)

        for _ in range(TRIALS):
            MEASUREMENTS.append(make_trial(places[random.randint(0, length - 1)]))

def draw() -> None:
    """
    Render a graph.
    """
    global MEASUREMENTS

    fig, ax = plt.subplots()

    ax.boxplot(MEASUREMENTS)

    ax.set_ylabel("Response time, ms")
    ax.set(xticklabels=[])
    ax.tick_params(bottom=False)
    ax.tick_params(labelsize=12)

    fig.tight_layout()
    plt.savefig(f"./perf-entity-places.pdf", format="pdf")

def main() -> None:
    measure()
    draw()
    print("Done.")

main()
